import { useEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { contact, navLinks, profile } from '../../data/profile'
import { SectionHeading, SplitText } from '../ui/Primitives'
import Magnetic, { MagneticDot } from '../ui/Magnetic'
import { CopyButton } from '../ui/Cursor'
import {
  IconArrowUpRight,
  IconDownload,
  IconGitHub,
  IconLinkedIn,
  IconMail,
  IconMapPin,
  IconPhone,
} from '../ui/Icons'

const formatIST = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: profile.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())

function LocalTime() {
  const [time, setTime] = useState(formatIST)
  const reduce = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setTime(formatIST()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return <span className="text-bone-faint">--:--</span>

  return (
    <span className="label text-bone-faint">
      {time.slice(0, 5)}
      {reduce ? null : <span className="text-bone-faint/60">:{time.slice(6)}</span>}
      <span className="ml-1.5 text-acid">IST</span>
    </span>
  )
}

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="relative pt-24 pb-10 md:pt-32">
      <div className="container-x">
        {/* CTA */}
        <div className="flex flex-col items-center text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: EASE.hard }}
          >
            <SectionHeading index="05" kicker={contact.kicker} align="center" />
          </m.div>

          {/* Headline set as a giant acid slab */}
          <m.h2
            className="mt-8 max-w-5xl border-2 border-ash-700 bg-ash-850 px-6 py-10 font-display text-[clamp(2.2rem,7vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] md:px-12 md:py-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE.hard, delay: 0.1 }}
          >
            <SplitText text={contact.title} className="text-bone" animate="inView" />
            <br />
            <span className="mt-3 inline-block bg-acid-fill px-3 pb-1">
              <SplitText
                text={contact.titleAccent}
                className="text-on-acid"
                delay={0.28}
                wordClassName="text-on-acid"
              />
            </span>
          </m.h2>

          <m.p
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-bone-mute md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: EASE.hard, delay: 0.2 }}
          >
            {contact.body}
          </m.p>

          {/* Primary actions */}
          <m.div
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: EASE.hard, delay: 0.25 }}
          >
            <Magnetic
              as="a"
              href={`mailto:${profile.email}`}
              className="btn-acid"
              data-cursor="hover"
              data-cursor-label="MAIL"
            >
              <IconMail size={17} />
              {profile.email}
            </Magnetic>

            <Magnetic as="a" href={profile.phoneHref} className="btn" data-cursor="hover">
              <IconPhone size={17} />
              Call
            </Magnetic>

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

          {/* Socials + copy */}
          <div className="mt-12 flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <MagneticDot
                href="https://linkedin.com/in/venkateshbs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <IconLinkedIn size={18} />
              </MagneticDot>
              <MagneticDot
                href="https://github.com/venkateshbs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <IconGitHub size={18} />
              </MagneticDot>
              <MagneticDot href={`mailto:${profile.email}`} aria-label="Email">
                <IconMail size={18} />
              </MagneticDot>
            </div>

            <CopyButton value={profile.email} className="tag mt-1 px-4! py-2.5!">
              <span className="hidden sm:inline">Copy email — </span>
              {profile.email}
            </CopyButton>
          </div>
        </div>

        {/* Footer bar — a hard 2px rule with a registration tick */}
        <div className="relative mt-20 border-t-2 border-ash-700 pt-8">
          <span aria-hidden="true" className="absolute -top-1 left-0 h-2 w-0.5 bg-acid" />
          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <p className="label text-bone-faint">
              © {year} {profile.fullName} — React, Framer Motion, WebGL
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="label flex items-center gap-1.5 text-bone-faint">
                <IconMapPin size={12} />
                {profile.location}
              </span>
              <LocalTime />
            </div>

            <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {navLinks.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className="label group inline-flex items-center gap-1 text-bone-faint transition-colors duration-150 hover:text-acid"
                >
                  {l.label}
                  <IconArrowUpRight
                    size={11}
                    className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
