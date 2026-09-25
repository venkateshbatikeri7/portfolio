import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { IconAsterisk } from '../ui/Icons'

const LINES = [
  { text: 'I do not ship code.', accent: true },
  { text: 'I ship systems that keep their', accent: false },
  { text: 'promises under load, under', accent: false },
  { text: 'change, and under deadline.', accent: false },
]

/**
 * Full-bleed kinetic statement. Each line's opacity is driven by scroll
 * position, so the block "develops" as it travels up the viewport. The accent
 * line is reversed out of a solid acid slab rather than tinted.
 */
export default function Manifesto() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'end 0.35'] })

  // Fixed number of hooks — one per line, never inside a loop.
  const p0 = useTransform(scrollYProgress, [0, 0.34], [0.12, 1])
  const p1 = useTransform(scrollYProgress, [0.2, 0.55], [0.12, 1])
  const p2 = useTransform(scrollYProgress, [0.4, 0.75], [0.12, 1])
  const p3 = useTransform(scrollYProgress, [0.6, 0.95], [0.12, 1])
  const progresses = [p0, p1, p2, p3]

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="container-x">
        <div className="relative border-t-2 border-ash-700 pt-12 md:pt-16">
          {/* Registration ticks */}
          <span aria-hidden="true" className="absolute -top-px left-0 h-4 w-0.5 bg-acid" />
          <span aria-hidden="true" className="absolute -top-px right-0 h-4 w-0.5 bg-acid" />

          <h2 className="font-display text-[clamp(1.75rem,5vw,3.75rem)] font-black uppercase leading-[1.06] tracking-[-0.04em]">
            {LINES.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1.5">
                <m.span
                  className={line.accent ? 'block w-fit bg-acid-fill px-3 text-on-acid' : 'block text-bone-dim'}
                  style={reduce ? undefined : { opacity: progresses[i] }}
                  initial={reduce ? { opacity: 1 } : { opacity: 0.12 }}
                >
                  {line.text}
                </m.span>
              </span>
            ))}
          </h2>

          <m.div
            className="mt-12 grid grid-cols-2 gap-px border-2 border-ash-700 bg-ash-700 sm:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            {['Reliability', 'Observability', 'Velocity', 'Ownership'].map((w) => (
              <div
                key={w}
                className="group flex items-center gap-2.5 bg-ash-850 px-4 py-3.5 transition-colors duration-150 hover:bg-acid-fill"
              >
                <IconAsterisk size={13} className="text-acid transition-colors duration-150 group-hover:text-on-acid" />
                <span className="label text-bone-dim transition-colors duration-150 group-hover:text-on-acid">
                  {w}
                </span>
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )
}
