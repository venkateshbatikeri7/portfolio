import { useRef } from 'react'
import { m, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cx } from '../../lib/utils'

/**
 * A button/link that leans toward the cursor.
 * Falls back to a plain scale on touch devices and when reduced motion is on.
 */
export default function Magnetic({
  children,
  className = '',
  strength = 0.34,
  radius = 90,
  as = 'button',
  ...rest
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 420, damping: 28, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 420, damping: 28, mass: 0.4 })

  const Comp = as === 'a' ? m.a : m.button
  const disabled = as !== 'a' && (rest.disabled || rest.type === 'submit')

  const onMove = (e) => {
    if (reduce || disabled) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx0 = r.left + r.width / 2
    const cy0 = r.top + r.height / 2
    const dx = e.clientX - cx0
    const dy = e.clientY - cy0
    const dist = Math.hypot(dx, dy)
    const reach = Math.max(r.width, r.height) / 2 + radius
    if (dist > reach) {
      mx.set(0)
      my.set(0)
      return
    }
    const falloff = 1 - dist / reach
    mx.set(dx * strength * falloff)
    my.set(dy * strength * falloff)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <Comp
      ref={ref}
      className={cx('relative isolate overflow-hidden', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerEnter={reset}
      onPointerLeave={reset}
      onBlur={reset}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      data-cursor="hover"
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Small magnetic dot used for social links. */
export function MagneticDot({ children, className = '', ...rest }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })
  const reduce = useReducedMotion()

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.45)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.45)
  }

  return (
    <m.a
      href={rest.href}
      target={rest.target}
      rel={rest.rel}
      aria-label={rest['aria-label']}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x: sx, y: sy }}
      className={cx(
        'group relative grid h-12 w-12 place-items-center border-2 border-ash-600 bg-ash-850 text-bone-dim transition-all duration-150 steps(2) hover:border-acid hover:bg-acid-fill hover:text-on-acid',
        className,
      )}
      data-cursor="hover"
    >
      <span className="relative">{children}</span>
    </m.a>
  )
}
