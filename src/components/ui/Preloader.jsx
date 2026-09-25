import { useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { profile } from '../../data/profile'

const STEPS = [
  { at: 0, label: 'Mounting runtime' },
  { at: 30, label: 'Linking modules' },
  { at: 62, label: 'Compiling shaders' },
  { at: 88, label: 'Verifying layout' },
  { at: 99, label: 'Ready' },
]

/**
 * Boot sequence. A hard counter readout rather than a soft progress bar —
 * the grid fills cell by cell, like a terminal filling a buffer.
 */
export default function Preloader({ onDone }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(reduce ? 100 : 0)
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(STEPS[0].label)

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(() => onDone?.(), 60)
      return () => clearTimeout(t)
    }

    const started = performance.now()
    const DURATION = 1500
    let raf = 0

    const tick = (now) => {
      const t = Math.min((now - started) / DURATION, 1)
      // Mechanical ramp: fast start, hard stop. No ease-out flourish.
      const eased = t === 1 ? 1 : 1 - Math.pow(1 - t, 3)
      const value = Math.round(eased * 100)
      setProgress(value)
      setStep(STEPS.reduce((acc, s) => (value >= s.at ? s.label : acc), STEPS[0].label))

      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setDone(true)
        setTimeout(() => onDone?.(), 500)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, onDone])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
    else document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  // 20 cells, filled left to right — a segmented bar, not a smooth wipe.
  const cells = 20
  const filled = Math.round((progress / 100) * cells)

  return (
    <AnimatePresence>
      {!done && (
        <m.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ash-900 px-5 py-6 md:px-8 md:py-8"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: EASE.hard }}
          aria-hidden="true"
        >
          <div aria-hidden="true" className="grid-field pointer-events-none absolute inset-0 opacity-60" />

          {/* Top row */}
          <div className="relative flex items-start justify-between gap-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="grid h-9 w-9 place-items-center bg-acid-fill font-display text-[13px] font-black text-on-acid">
                {profile.initials}
              </span>
              <span className="label text-bone">{profile.fullName}</span>
            </m.div>
            <m.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="label text-bone-faint"
            >
              Portfolio / 2026
            </m.span>
          </div>

          {/* Centre: giant counter + segmented bar */}
          <div className="relative flex flex-col items-center gap-7">
            <div className="flex items-baseline">
              <m.span
                className="font-display text-[clamp(5rem,22vw,15rem)] font-black leading-none tracking-tighter text-bone tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {String(progress).padStart(3, '0')}
              </m.span>
              <span className="ml-1 font-display text-[clamp(1.5rem,4vw,3rem)] font-black text-acid">%</span>
            </div>

            <div className="flex w-[min(86vw,34rem)] gap-[3px]">
              {Array.from({ length: cells }, (_, i) => (
                <span
                  key={i}
                  className="h-6 flex-1 border-2 border-ash-600 transition-colors duration-75"
                  style={{ background: i < filled ? 'var(--c-acid-fill)' : 'transparent' }}
                />
              ))}
            </div>

            <m.p
              key={step}
              className="label-lg text-bone-mute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {step}
              <span className="animate-blink text-acid">_</span>
            </m.p>
          </div>

          {/* Bottom row */}
          <div className="relative flex items-end justify-between gap-4">
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="label text-bone-faint"
            >
              Full stack / Cloud / AI
            </m.p>
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="label text-bone-faint"
            >
              Bengaluru, IN
            </m.p>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
