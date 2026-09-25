import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import { hasFinePointer } from '../../lib/utils'

/**
 * Brutalist cursor: a hard square outline that lags on a stiff spring, plus an
 * instant acid dot. Over interactive elements the square inverts to acid and
 * snaps to a filled state — no soft rings, no blur.
 */
export default function Cursor() {
  const [enabled] = useState(() => hasFinePointer())
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState('default') // default | hover
  const [label, setLabel] = useState('')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const dotX = useSpring(x, { stiffness: 1600, damping: 70, mass: 0.2 })
  const dotY = useSpring(y, { stiffness: 1600, damping: 70, mass: 0.2 })
  const boxX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 })
  const boxY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 })

  const raf = useRef(0)
  const queued = useRef({ x: 0, y: 0 })
  const seen = useRef(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor')

    const move = (e) => {
      queued.current = { x: e.clientX, y: e.clientY }
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          x.set(queued.current.x)
          y.set(queued.current.y)
          raf.current = 0
        })
      }
      if (!seen.current) {
        seen.current = true
        setVisible(true)
      }

      const el = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      if (el) {
        setVariant(el.dataset.cursor === 'hover' ? 'hover' : el.dataset.cursor)
        setLabel(el.dataset.cursorLabel ?? '')
      } else {
        setVariant('default')
        setLabel('')
      }
    }

    const hide = () => {
      seen.current = false
      setVisible(false)
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const isHover = variant === 'hover'

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      {/* Hard square outline */}
      <m.div
        className="absolute border-2 border-acid"
        style={{ x: boxX, y: boxY, width: 34, height: 34, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isHover ? 2.1 : 1,
          // color-mix so the fill tracks the themed accent in both modes.
          backgroundColor: isHover ? 'color-mix(in srgb, var(--c-acid) 16%, transparent)' : 'transparent',
        }}
        transition={{ duration: 0.12, ease: [0.85, 0, 0.15, 1] }}
      >
        <m.span
          className="absolute inset-0 grid place-items-center font-mono text-[9px] font-bold tracking-wider text-acid"
          animate={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </m.span>
      </m.div>

      {/* Instant centre dot */}
      <m.div
        className="absolute h-2 w-2 bg-bone"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && !isHover ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

/** Toast-style copy-to-clipboard button used in the contact section. */
export function CopyButton({ value, children, className = '' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <m.button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
        } catch {
          window.location.href = `mailto:${value}`
        }
      }}
      className={className}
      whileTap={{ scale: 0.97 }}
      data-cursor="hover"
      data-cursor-label="COPY"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={copied ? 'copied' : 'idle'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: [0.85, 0, 0.15, 1] }}
          className="block"
        >
          {copied ? 'Copied' : children}
        </m.span>
      </AnimatePresence>
    </m.button>
  )
}
