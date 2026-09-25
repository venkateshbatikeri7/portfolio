import { m } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { about } from '../../data/profile'
import { Reveal, ScrollText, SectionHeading } from '../ui/Primitives'
import { pillarIcons } from '../../lib/theme'
import { IconAsterisk } from '../ui/Icons'

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading index="01" kicker={about.kicker} title={about.title} blurb={about.lede} />

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Narrative — words illuminate as you scroll */}
          <div className="lg:col-span-7">
            <div className="border-2 border-ash-700 bg-ash-850 p-6 md:p-8">
              <span className="label mb-5 flex items-center gap-2 text-bone-faint">
                <IconAsterisk size={12} className="text-acid" />
                Readout
              </span>
              <ScrollText
                text={about.body}
                className="text-base leading-relaxed text-bone-dim md:text-xl"
              />
            </div>

            <Reveal delay={0.05}>
              <div className="mt-6 grid grid-cols-2 gap-px border-2 border-ash-700 bg-ash-700">
                <Stat label="AWS services shipped" value="EC2 · S3 · Lambda · Glue" />
                <Stat label="Team size led" value="5 – 7 engineers" />
                <Stat label="Degree" value="B.Tech · Information Science" />
                <Stat label="Languages" value="English · Kannada · Telugu" />
              </div>
            </Reveal>
          </div>

          {/* Pillars — hard panels that throw a shadow on hover */}
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-5 overflow-x-clip">
              {about.pillars.map((p, i) => {
                const Icon = pillarIcons[p.icon] ?? IconAsterisk
                return (
                  <m.article
                    key={p.title}
                    className="panel-hard tick-corner group relative p-6"
                    initial={{ opacity: 0, x: 34 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, ease: EASE.hard, delay: i * 0.08 }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-acid bg-ash-900 text-acid transition-colors duration-150 group-hover:bg-acid-fill group-hover:text-on-acid">
                        <Icon size={19} />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-extrabold uppercase tracking-tight text-bone">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-bone-mute">{p.text}</p>
                      </div>
                    </div>
                    <span className="absolute bottom-5 right-6 font-mono text-[11px] text-bone-faint">
                      0{i + 1}
                    </span>
                  </m.article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-ash-850 px-4 py-4 transition-colors duration-150 hover:bg-ash-800">
      <p className="label text-bone-faint">{label}</p>
      <p className="mt-2 text-[13px] leading-snug font-medium text-bone-dim">{value}</p>
    </div>
  )
}
