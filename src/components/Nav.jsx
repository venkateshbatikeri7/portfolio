import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { cx } from '../lib/utils'
import { EASE } from '../lib/motion'
import { navLinks, profile } from '../data/profile'
import { IconArrowUpRight, IconClose, IconGrid, IconMenu } from './ui/Icons'
import ThemeToggle from './ui/ThemeToggle'

/**
 * Brutalist masthead: a solid ruled bar pinned to the top edge. No glass, no
 * pill, no rounding — the bar is separated from the page by a hard rule and a
 * segmented acid progress meter.
 */
export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 34, mass: 0.3 })
  const lastY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - lastY.current
    if (Math.abs(delta) > 4) {
      setHidden(y > 160 && delta > 0 && !open)
      lastY.current = y
    }
  })

  // Scroll-spy.
  useEffect(() => {
    const ids = navLinks.map((l) => l.id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Segmented progress meter, flush to the very top edge */}
      <m.div
        className="fixed inset-x-0 top-0 z-[95] h-1 origin-left bg-acid"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <m.header
        className="fixed inset-x-0 top-1 z-[90] border-b-2 border-ash-700 bg-ash-900"
        initial={reduce ? false : { y: -64 }}
        animate={reduce ? {} : { y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: EASE.hard }}
      >
        <nav
          className="container-x flex items-center justify-between gap-4 py-3"
          style={{ maxWidth: 'none' }}
          aria-label="Primary"
        >
          {/* Wordmark — solid acid square, no border, no rounding */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            className="group flex items-center gap-3"
            data-cursor="hover"
            aria-label="Back to top"
          >
            <span className="grid h-9 w-9 place-items-center bg-acid-fill font-display text-[13px] font-black text-on-acid transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:shadow-[3px_3px_0_0_var(--c-bone)]">
              {profile.initials}
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[15px] font-extrabold uppercase tracking-tight text-bone">
                {profile.firstName}
              </span>
              <span className="label mt-1 text-bone-faint">{profile.roleShort}</span>
            </span>
          </button>

          {/* Desktop links — the active one is a solid acid block */}
          <ul className="hidden items-stretch border-2 border-ash-700 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id} className="border-l-2 border-ash-700 first:border-l-0">
                  <button
                    onClick={() => go(link.id)}
                    className={cx(
                      'label flex items-center gap-2 px-4 py-3 transition-colors duration-150',
                      isActive
                        ? 'bg-acid-fill text-on-acid'
                        : 'text-bone-mute hover:bg-ash-800 hover:text-bone',
                    )}
                    data-cursor="hover"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className={cx('hidden xl:inline', isActive ? 'text-on-acid/60' : 'text-bone-faint')}>
                      {link.index}
                    </span>
                    {link.label}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:grid" />

            <a
              href={`mailto:${profile.email}`}
              className="label hidden items-center gap-2 border-2 border-acid bg-acid-fill px-4 py-3 text-on-acid transition-all duration-150 hover:border-bone hover:bg-bone hover:text-invert hover:shadow-[4px_4px_0_0_var(--c-acid)] lg:inline-flex"
              data-cursor="hover"
              data-cursor-label="MAIL"
            >
              Let&rsquo;s talk
              <IconArrowUpRight size={14} />
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center border-2 border-ash-600 text-bone transition-colors duration-150 hover:border-acid hover:bg-acid-fill hover:text-on-acid md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              data-cursor="hover"
            >
              {open ? <IconClose size={18} /> : <IconMenu size={18} />}
            </button>
          </div>
        </nav>
      </m.header>

      {/* Mobile sheet — flat slab, no blur, list items as bordered rows */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[89] md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: EASE.hard }}
          >
            <div className="grid-field absolute inset-0 bg-ash-900" onClick={() => setOpen(false)} />
            <m.div
              className="relative flex h-full flex-col justify-center px-5 pt-16"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { delayChildren: 0.12, staggerChildren: 0.05 } } }}
            >
              <span className="label mb-4 text-bone-faint">Index</span>
              {navLinks.map((link) => (
                <m.button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="group flex items-center gap-4 border-b-2 border-ash-700 py-4 text-left"
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE.hard } },
                  }}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center border-2 border-ash-600 text-[10px] text-bone-faint transition-colors duration-150 group-hover:border-acid group-hover:bg-acid-fill group-hover:text-on-acid">
                    <IconGrid size={13} />
                  </span>
                  <span className="label text-bone-faint">{link.index}</span>
                  <span className="font-display text-2xl font-black uppercase text-bone transition-colors duration-150 group-hover:text-acid">
                    {link.label}
                  </span>
                </m.button>
              ))}

              <m.a
                href={`mailto:${profile.email}`}
                className="btn-acid mt-8 w-full"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.hard } },
                }}
              >
                {profile.email}
              </m.a>

              <m.div
                className="mt-3 flex items-center justify-between gap-4 border-2 border-ash-700 px-4 py-3"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.hard } },
                }}
              >
                <span className="label text-bone-mute">Appearance</span>
                <ThemeToggle />
              </m.div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
