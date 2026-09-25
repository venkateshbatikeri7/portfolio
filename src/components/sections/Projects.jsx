import { useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { cx } from '../../lib/utils'
import { projects } from '../../data/profile'
import { accentMap } from '../../lib/theme'
import { SectionHeading } from '../ui/Primitives'
import BrutalCard from '../ui/BrutalCard'
import { IconArrowUpRight } from '../ui/Icons'

/* 12-column bento rhythm — wide / narrow alternation keeps the eye moving. */
const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-6',
  'lg:col-span-6',
]

const SIZES = ['min-h-[24rem] md:min-h-[27rem]', 'min-h-[24rem] md:min-h-[27rem]', 'min-h-[22rem]', 'min-h-[22rem]', 'min-h-[21rem]', 'min-h-[21rem]']

export default function Projects() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <SectionHeading
              index="03"
              kicker="Selected work"
              title="Case studies,"
              accent="measured in outcomes."
            />
          </div>

          <p className="label max-w-xs leading-relaxed text-bone-faint lg:text-right">
            Hover a card to inspect
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} span={SPANS[i]} size={SIZES[i]} order={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, span, size, order }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const accent = accentMap[project.accent] ?? accentMap.acid

  return (
    <m.div
      ref={ref}
      className={cx('group', span)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE.hard, delay: (order % 2) * 0.08 }}
    >
      <BrutalCard className={cx('relative h-full', size)}>
        {/* Faint grid inside the card */}
        <span aria-hidden="true" className="grid-field pointer-events-none absolute inset-0 opacity-40" />

        <div className="preserve-3d relative flex h-full flex-col p-6 md:p-7">
          {/* Header row — the tag carries the project's accent colour */}
          <div className="flex items-start justify-between gap-4">
            <span
              className="tag group-hover:border-ash-600 group-hover:text-bone-dim"
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              {project.tag}
            </span>
            <span
              className="font-display text-[42px] font-black leading-none tracking-tighter text-ash-700 transition-colors duration-150 group-hover:text-ash-600"
            >
              {project.index}
            </span>
          </div>

          <h3 className="mt-6 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-extrabold uppercase leading-tight text-bone">
            {project.title}
          </h3>

          <p className="mt-3.5 text-[14px] leading-relaxed text-bone-mute">{project.description}</p>

          {/* Metrics — segmented bars, no rounding */}
          <div className="mt-auto space-y-3 pt-8">
            <div className="space-y-2.5">
              {project.metrics.map((metric, mi) => (
                <div key={metric.k}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="label text-bone-faint">{metric.k}</span>
                    <span className="label text-bone-dim">{metric.v}</span>
                  </div>
                  <div className="relative flex h-2 gap-[2px]">
                    {Array.from({ length: 10 }, (_, seg) => (
                      <span key={seg} className="h-full flex-1 bg-ash-700" />
                    ))}
                    <m.span
                      className="absolute inset-0 flex origin-left"
                      style={{ transformOrigin: 'left' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: reduce ? 1 : inView ? metric.v / 100 : 0 }}
                      transition={{ duration: 0.5, ease: EASE.hard, delay: 0.2 + mi * 0.08 }}
                    >
                      {Array.from({ length: 10 }, (_, seg) => (
                        <span key={seg} className="h-full flex-1 bg-acid-fill" />
                      ))}
                    </m.span>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact */}
            <div className="mt-6 flex items-end justify-between gap-4 border-t-2 border-ash-700 pt-5">
              <div>
                <p className="label text-bone-faint">Impact</p>
                <p className="mt-1 font-display text-[30px] font-black leading-none tracking-tighter text-acid">
                  {project.impact}
                </p>
                <p className="mt-1.5 text-[12px] text-bone-mute">{project.impactLabel}</p>
              </div>

              <span
                className={cx(
                  'grid h-11 w-11 shrink-0 place-items-center border-2 transition-colors duration-150',
                  'border-ash-600 text-bone-mute group-hover:border-acid group-hover:bg-acid-fill group-hover:text-on-acid',
                )}
              >
                <IconArrowUpRight size={18} />
              </span>
            </div>
          </div>

          {/* Stack */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </BrutalCard>
    </m.div>
  )
}
