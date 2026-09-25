import { useRef, useState } from 'react'
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { cx } from '../../lib/utils'

/**
 * Brutalist card: flat surface, heavy border, and a hard offset shadow that
 * snaps into place on hover. The pointer position drives a small parallax
 * nudge so the card still feels alive without resorting to 3D tilt.
 */
export default function BrutalCard({
  children,
  className = '',
  intensity = 6,
  lift = -6,
  as = 'div',
  ...rest
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hoverAmount = useMotionValue(0)

  const tx = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), { stiffness: 320, damping: 26 })
  const ty = useSpring(useTransform(hoverAmount, [0, 1], [0, lift]), { stiffness: 320, damping: 26 })

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const onEnter = () => {
    setHovered(true)
    hoverAmount.set(1)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
    hoverAmount.set(0)
    setHovered(false)
  }

  const Comp = m[as] ?? m.div

  return (
    <Comp
      ref={ref}
      className={cx(
        'panel-hard relative h-full overflow-hidden',
        hovered && 'border-acid shadow-[6px_6px_0_0_var(--c-acid)]',
        className,
      )}
      style={reduce ? undefined : { x: tx, y: ty }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={reset}
      data-cursor="hover"
      {...rest}
    >
      {children}
    </Comp>
  )
}
