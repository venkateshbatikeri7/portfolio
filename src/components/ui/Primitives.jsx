import { m, useInView, useReducedMotion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cx, splitWords } from '../../lib/utils'
import { EASE, riseIn } from '../../lib/motion'

/* ------------------------------------------------------------------ *
 *  Reveal — generic scroll-in wrapper
 * ------------------------------------------------------------------ */
export function Reveal({
  children,
  className = '',
  delay = 0,
  distance = 28,
  once = true,
  amount = 0.25,
  as = 'div',
}) {
  const Comp = m[as] ?? m.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: riseIn(distance).hidden,
        show: { ...riseIn(distance).show, transition: { ...riseIn(distance).show.transition, delay } },
      }}
    >
      {children}
    </Comp>
  )
}

/* ------------------------------------------------------------------ *
 *  SplitText — word-by-word mask reveal
 * ------------------------------------------------------------------ */
export function SplitText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger: step = 0.055,
  animate = 'inView',
  once = true,
  as: Tag = 'span',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, amount: 0.4, margin: '0px 0px -8% 0px' })
  const reduce = useReducedMotion()
  const words = splitWords(text)
  const active = animate === 'mount' ? true : inView

  return (
    <Tag ref={ref} className={cx('inline', className)} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
          <m.span
            className={cx('inline-block', wordClassName)}
            initial={reduce ? { opacity: 0 } : { y: '118%' }}
            animate={active ? { y: '0%', opacity: 1 } : undefined}
            transition={{
              duration: reduce ? 0.3 : 0.55,
              ease: EASE.hard,
              delay: delay + i * step,
            }}
            style={{ transformOrigin: 'bottom center' }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ *
 *  ScrollText — words light up as they pass through the viewport
 * ------------------------------------------------------------------ */
export function ScrollText({ text, className = '', start = 'start end', end = 'end center' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: [start, end] })
  const words = splitWords(text)
  const total = words.length || 1

  return (
    <p ref={ref} className={cx('leading-relaxed', className)}>
      {words.map((w, i) => (
        <ScrollWord key={`${w}-${i}`} progress={scrollYProgress} startPct={i / total} endPct={(i + 1) / total} reduce={reduce}>
          {w}
        </ScrollWord>
      ))}
    </p>
  )
}

function ScrollWord({ progress, startPct, endPct, children, reduce }) {
  const opacity = useTransform(progress, [startPct, endPct], [0.14, 1])

  if (reduce) return <span className="text-bone-dim">{children} </span>

  return (
    <m.span className="inline-block" style={{ opacity }}>
      <span className="text-bone-dim">{children} </span>
    </m.span>
  )
}

/* ------------------------------------------------------------------ *
 *  SectionHeading — the index + kicker + title block used everywhere
 * ------------------------------------------------------------------ */
export function SectionHeading({ index, kicker, title, accent, blurb, align = 'left' }) {
  return (
    <div className={cx('flex flex-col gap-6', align === 'center' && 'items-center text-center')}>
      <Reveal distance={14}>
        <div
          className={cx(
            'flex items-center gap-3 border-2 border-ash-600 bg-ash-850 px-3 py-2',
            align === 'center' && 'justify-center',
          )}
        >
          {index && <span className="label text-acid">{index}</span>}
          <span className="h-3 w-0.5 bg-ash-500" />
          <span className="label text-bone-mute">{kicker}</span>
        </div>
      </Reveal>

      {title && (
        <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.6rem)] font-black uppercase">
          <SplitText text={title} />
          {accent && (
            <>
              {' '}
              <SplitText
                text={accent}
                wordClassName="text-acid"
                delay={splitWords(title).length * 0.055}
              />
            </>
          )}
        </h2>
      )}

      {blurb && (
        <Reveal delay={0.12}>
          <p
            className={cx(
              'max-w-2xl border-l-4 border-acid pl-5 text-base leading-relaxed text-bone-mute md:text-lg',
              align === 'center' && 'mx-auto',
            )}
          >
            {blurb}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Counter — animates a number when it scrolls into view
 * ------------------------------------------------------------------ */
export function Counter({ value, suffix = '', duration = 1.2, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const mv = useMotionValue(reduce ? value : 0)
  const text = useTransform(mv, (v) => Math.round(v).toString())

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration, ease: [0.85, 0, 0.15, 1] })
    return () => controls.stop()
  }, [inView, value, duration, reduce, mv])

  return (
    <m.span ref={ref} className={cx('tabular-nums', className)}>
      {reduce ? String(value) : <m.span>{text}</m.span>}
      {suffix}
    </m.span>
  )
}

/* ------------------------------------------------------------------ *
 *  Pill — the small square tag used for stacks and categories
 * ------------------------------------------------------------------ */
export function Pill({ children, className = '', tone = 'default' }) {
  const tones = {
    default: 'border-ash-600 text-bone-mute hover:border-acid hover:text-acid',
    accent: 'border-acid text-acid',
  }
  return (
    <span className={cx('tag', tones[tone], className)}>
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 *  AvailabilityBadge
 * ------------------------------------------------------------------ */
export function AvailabilityBadge({ label, className = '' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2.5 border-2 border-acid bg-acid-fill px-3 py-1.5 label text-on-acid',
        className,
      )}
    >
      <span className="relative grid h-2 w-2 place-items-center">
        <span className="absolute h-2 w-2 animate-ping bg-on-acid/60" />
        <span className="h-2 w-2 bg-on-acid" />
      </span>
      {label}
    </span>
  )
}
