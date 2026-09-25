import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { heroStats, profile, rotatingRoles } from '../../data/profile'
import { AvailabilityBadge, Counter } from '../ui/Primitives'
import Magnetic from '../ui/Magnetic'
import { IconArrowDown, IconArrowUpRight, IconDownload, IconGrid } from '../ui/Icons'

function RotatingRole() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % rotatingRoles.length), 2600)
    return () => clearInterval(id)
  }, [reduce])

  if (reduce) return <span className="text-acid">{rotatingRoles[0]}</span>

  return (
    <span className="relative inline-flex h-[1.15em] min-w-[1px] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={rotatingRoles[i]}
          className="text-acid block"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE.hard }}
        >
          {rotatingRoles[i]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  const intro = {
    hidden: {},
    show: { transition: { delayChildren: 0.1, staggerChildren: 0.07 } },
  }

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.hard } },
  }

  const show = ready ? 'show' : 'hidden'

  return (
    <section id="hero" ref={ref} className="relative flex min-h-[100svh] flex-col justify-center pt-28">
      <m.div
        className="container-x"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Availability + location */}
        <m.div className="mb-8 flex flex-wrap items-center gap-3" variants={intro} initial="hidden" animate={show}>
          <m.div variants={item}>
            <AvailabilityBadge label={profile.availability} />
          </m.div>
          <m.div
            variants={item}
            className="label flex items-center gap-2 border-2 border-ash-700 px-3 py-2 text-bone-mute"
          >
            <span className="h-1.5 w-1.5 bg-acid" />
            {profile.location}
          </m.div>
        </m.div>

        {/* Headline — name in bone, surname reversed out of an acid block */}
        <h1 className="font-display font-black uppercase">
          <span className="block overflow-hidden pb-1">
            <m.span
              className="block text-[clamp(2.9rem,10vw,8rem)] leading-[0.88] tracking-[-0.05em] text-bone"
              initial={reduce ? { opacity: 0 } : { y: '110%' }}
              animate={ready ? { y: '0%', opacity: 1 } : undefined}
              transition={{ duration: 0.55, ease: EASE.hard, delay: 0.12 }}
            >
              {profile.firstName}
              {' '}
              <span className="inline-block bg-acid-fill px-3 pb-1 text-on-acid">{profile.lastName}</span>
            </m.span>
          </span>

          <span className="mt-4 block min-h-[2.2em] overflow-hidden font-mono text-[clamp(0.8rem,2.1vw,1.3rem)] font-medium tracking-tight sm:mt-5">
            <m.span
              className="block text-bone-mute"
              initial={reduce ? { opacity: 0 } : { y: '110%' }}
              animate={ready ? { y: '0%', opacity: 1 } : undefined}
              transition={{ duration: 0.55, ease: EASE.hard, delay: 0.22 }}
            >
              <span className="text-bone-faint">&gt;&nbsp;</span>
              <RotatingRole />
              <span className="animate-blink text-acid">_</span>
            </m.span>
          </span>
        </h1>

        {/* Lede */}
        <m.p className="mt-8 max-w-xl text-base leading-relaxed text-bone-dim md:text-lg" variants={intro} initial="hidden" animate={show}>
          <m.span variants={item} className="block">
            {profile.tagline}
          </m.span>
          <m.span variants={item} className="mt-3 block text-bone-mute">
            Six years turning ambiguous requirements into{' '}
            <span className="text-bone">cloud-native systems</span> and{' '}
            <span className="text-bone">AI-powered automation</span> that hold up under enterprise load.
          </m.span>
        </m.p>

        {/* CTAs */}
        <m.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          variants={intro}
          initial="hidden"
          animate={show}
        >
          <m.div variants={item}>
            <Magnetic
              as="a"
              href="#work"
              className="btn-acid"
              data-cursor="hover"
              data-cursor-label="GO"
            >
              <IconGrid size={17} />
              Explore my work
            </Magnetic>
          </m.div>

          <m.div variants={item}>
            <Magnetic
              as="a"
              href={profile.resume}
              type="application/pdf"
              download={profile.resumeFileName}
              className="btn"
              data-cursor="hover"
            >
              <IconDownload size={17} />
              Résumé
            </Magnetic>
          </m.div>

          <m.div variants={item}>
            <a
              href={`mailto:${profile.email}`}
              className="label group inline-flex items-center gap-2 border-b-2 border-ash-600 pb-1 text-bone-mute transition-colors duration-150 hover:border-acid hover:text-acid"
              data-cursor="hover"
            >
              {profile.email}
              <IconArrowUpRight
                size={14}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>
          </m.div>
        </m.div>

        {/* Stats — gap-as-gridline, cells invert to acid on hover */}
        <m.div
          className="mt-14 grid grid-cols-2 gap-[2px] border-2 border-ash-700 bg-ash-700 md:mt-16 md:grid-cols-4"
          variants={intro}
          initial="hidden"
          animate={show}
        >
          {heroStats.map((s) => (
            <m.div
              key={s.label}
              variants={item}
              className="group relative bg-ash-850 px-5 py-6 transition-colors duration-150 hover:bg-acid-fill hover:text-on-acid"
            >
              <div className="font-display text-[clamp(1.9rem,4.5vw,2.75rem)] font-black leading-none tracking-tighter">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="label mt-3 text-bone-mute transition-colors duration-150 group-hover:text-on-acid/70">
                {s.label}
              </p>
            </m.div>
          ))}
        </m.div>
      </m.div>

      {/* Scroll hint — a hard block with a stepping arrow */}
      <m.div
        className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
        style={{ opacity: reduce ? 0.6 : scrollHintOpacity }}
        aria-hidden="true"
      >
        <span className="label text-bone-faint">Scroll</span>
        <m.span
          className="grid h-9 w-9 place-items-center border-2 border-ash-600 text-acid"
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'steps(3)' }}
        >
          <IconArrowDown size={15} />
        </m.span>
      </m.div>
    </section>
  )
}
