import {
  IconCloud,
  IconCode,
  IconCompass,
  IconDatabase,
  IconLayers,
  IconMonitor,
  IconServer,
  IconShield,
  IconSpark,
  IconTarget,
  IconZap,
} from '../components/ui/Icons'

/** Icon lookup for the skill groups in `data/profile.js`. */
export const skillIcons = {
  monitor: IconMonitor,
  server: IconServer,
  cloud: IconCloud,
  database: IconDatabase,
  spark: IconSpark,
  compass: IconCompass,
  code: IconCode,
  layers: IconLayers,
  zap: IconZap,
  target: IconTarget,
  shield: IconShield,
}

/** Icon lookup for the About pillars, keyed by `data/profile.js`. */
export const pillarIcons = {
  layers: IconLayers,
  zap: IconZap,
  spark: IconSpark,
  target: IconTarget,
  shield: IconShield,
}

/**
 * Per-project accents. Deliberately narrow: one acid plus three hard signals.
 * `hex` is for inline styles / canvas, the rest are Tailwind classes.
 */
export const accentMap = {
  acid: {
    text: 'text-acid',
    bg: 'bg-acid',
    border: 'border-acid',
    on: 'text-black',
    hex: '#dfff00',
  },
  red: {
    text: 'text-signal-red',
    bg: 'bg-signal-red',
    border: 'border-signal-red',
    on: 'text-black',
    hex: '#ff3b1f',
  },
  blue: {
    text: 'text-signal-blue',
    bg: 'bg-signal-blue',
    border: 'border-signal-blue',
    on: 'text-black',
    hex: '#2f6bff',
  },
  orange: {
    text: 'text-signal-orange',
    bg: 'bg-signal-orange',
    border: 'border-signal-orange',
    on: 'text-black',
    hex: '#ff7a00',
  },
}
