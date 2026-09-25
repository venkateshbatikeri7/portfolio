import { m } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { marqueeItems, skillGroups } from '../../data/profile'
import { skillIcons } from '../../lib/theme'
import { SectionHeading } from '../ui/Primitives'
import { IconAsterisk } from '../ui/Icons'

export default function Stack() {
  return (
    <section id="stack" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="04"
          kicker="Toolkit"
          title="Technical depth,"
          accent="delivered on time."
          blurb="Six years of shipping means the stack is a means, not an identity. These are the tools I reach for — and the patterns behind them."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <SkillCard key={group.key} group={group} index={i} />
          ))}
        </div>

        <Marquee />
      </div>
    </section>
  )
}

function SkillCard({ group, index }) {
  const Icon = skillIcons[group.icon] ?? skillIcons.spark

  return (
    <m.article
      className="panel-hard group relative flex flex-col p-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE.hard, delay: (index % 3) * 0.07 }}
    >
      <div className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-ash-600 text-acid transition-colors duration-150 group-hover:border-acid group-hover:bg-acid-fill group-hover:text-on-acid">
          <Icon size={19} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold uppercase tracking-tight text-bone">{group.label}</h3>
          <p className="mt-1.5 text-[12px] leading-snug text-bone-mute">{group.blurb}</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {group.skills.map((s, k) => (
          <m.li
            key={s}
            className="tag"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, ease: EASE.hard, delay: 0.1 + k * 0.03 }}
          >
            {s}
          </m.li>
        ))}
      </ul>
    </m.article>
  )
}

function Marquee() {
  const row = [...marqueeItems, ...marqueeItems]

  return (
    <div className="relative mt-14 overflow-hidden border-2 border-ash-700 md:mt-16">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-3 border-r-2 border-ash-700 px-6 py-3.5 font-display text-[13px] font-bold uppercase whitespace-nowrap text-bone-mute"
          >
            <IconAsterisk size={12} className="text-acid" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
