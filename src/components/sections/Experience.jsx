import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { cx } from '../../lib/utils'
import { experience } from '../../data/profile'
import { SectionHeading } from '../ui/Primitives'
import { IconCheck, IconMapPin } from '../ui/Icons'

export default function Experience() {
  const wrap = useRef(null)
  const reduce = useReducedMotion()

  // The spine fills as the section passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ['start 78%', 'end 62%'],
  })
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="02"
          kicker="Career journey"
          title="Six years, four chapters,"
          accent="one direction."
          blurb="From banking back-ends to cloud-native platforms to AI agents — each chapter added a layer to the same craft: making complex systems feel simple."
        />

        <div ref={wrap} className="relative mt-16 overflow-x-clip md:mt-20">
          {/* Spine — a solid 2px rule, filled with acid as you scroll */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-ash-700 md:left-0"
          >
            <m.div
              className="h-full w-full origin-top bg-acid"
              style={{ scaleY: reduce ? 1 : spine }}
            />
          </div>

          {/* Most recent first — order is driven by `data/profile.js` */}
          <ol className="space-y-6 md:space-y-8">
            {experience.map((job, i) => (
              <TimelineItem key={job.company} job={job} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ job, index }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'start 55%'] })
  const nodeScale = useTransform(scrollYProgress, [0, 1], [0.3, 1])

  return (
    <li ref={ref} className="relative pl-10 md:pl-14">
      {/* Node — a hard square, not a dot */}
      <m.span
        aria-hidden="true"
        className="absolute top-6 left-0 z-10 grid h-4 w-4 place-items-center"
        style={{ scale: reduce ? 1 : nodeScale }}
      >
        <span
          className={cx(
            'block h-4 w-4 border-2',
            job.current ? 'border-acid bg-acid-fill' : 'border-ash-500 bg-ash-900',
          )}
        />
      </m.span>

      <m.article
        className={cx(
          'group relative border-2 p-6 transition-colors duration-150 md:p-8',
          job.current
            ? 'border-acid bg-ash-850 shadow-[6px_6px_0_0_var(--c-acid)]'
            : 'border-ash-700 bg-ash-850 hover:border-ash-500',
        )}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: EASE.hard, delay: index * 0.05 }}
        data-cursor="hover"
      >
        {/* Huge ordinal, bled into the corner */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-1 right-3 select-none font-display text-[5rem] font-black leading-none text-ash-700 md:text-[7rem]"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <p className="label text-acid">{job.period}</p>
            <h3 className="mt-3 font-display text-[22px] font-black uppercase leading-none tracking-tight text-bone md:text-[30px]">
              {job.company}
            </h3>
            <p className="mt-2 text-[15px] font-medium text-bone-dim">{job.role}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className={job.current ? 'tag-acid' : 'tag'}>{job.tag}</span>
            {job.current && (
              <span className="label flex items-center gap-1.5 text-acid">
                <span className="h-1.5 w-1.5 animate-pulse bg-acid" />
                Current
              </span>
            )}
            <span className="label flex items-center gap-1.5 text-bone-faint">
              <IconMapPin size={12} />
              {job.location}
            </span>
          </div>
        </div>

        <ul className="relative mt-7 grid gap-3 md:grid-cols-2 md:gap-x-8">
          {job.points.map((p, k) => (
            <m.li
              key={p}
              className="flex gap-3 text-[14px] leading-relaxed text-bone-mute"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: EASE.hard, delay: 0.12 + k * 0.05 }}
            >
              <span className="mt-[3px] shrink-0 text-acid">
                <IconCheck size={14} />
              </span>
              <span>{p}</span>
            </m.li>
          ))}
        </ul>

        <div className="relative mt-7 flex flex-wrap gap-1.5 border-t-2 border-ash-700 pt-5">
          {job.stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </m.article>
    </li>
  )
}
