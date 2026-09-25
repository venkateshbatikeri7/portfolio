/**
 * Brutalist icon set.
 *
 * Design rules, applied to every glyph:
 *   · 24×24 grid, 2px stroke
 *   · square line caps + mitre joins — no rounded terminals
 *   · straight lines and hard rectangles wherever the form allows
 *   · built from paths only, so there is no icon-package dependency
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  strokeMiterlimit: 2,
}

const Svg = ({ children, size = 20, className = '', ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
    shapeRendering="geometricPrecision"
    {...base}
    {...rest}
  >
    {children}
  </svg>
)

/* ------------------------------------------------------------------ *
 *  Directional
 * ------------------------------------------------------------------ */

export const IconArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M6 18 18 6M8 6h10v10" />
  </Svg>
)

export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M3 12h18M15 6l6 6-6 6" />
  </Svg>
)

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M21 12H3M9 6 3 12l6 6" />
  </Svg>
)

export const IconArrowDown = (p) => (
  <Svg {...p}>
    <path d="M12 3v18M6 15l6 6 6-6" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 *  Contact
 * ------------------------------------------------------------------ */

export const IconMail = (p) => (
  <Svg {...p}>
    <rect x="2" y="4" width="20" height="16" />
    <path d="m2 6 10 8 10-8" />
  </Svg>
)

export const IconPhone = (p) => (
  <Svg {...p}>
    <path d="M4 2h4l2 5-3 2a14 14 0 0 0 8 8l2-3 5 2v4a2 2 0 0 1-2 2A19 19 0 0 1 2 4a2 2 0 0 1 2-2Z" />
  </Svg>
)

export const IconMapPin = (p) => (
  <Svg {...p}>
    <path d="M12 2v22M12 2 3 7v15l9 0 9 0V7l-9-5Z" />
    <path d="M3 7l9 5 9-5M3 22l9-5 9 5" />
  </Svg>
)

export const IconDownload = (p) => (
  <Svg {...p}>
    <path d="M12 2v14M6 10l6 6 6-6M3 22h18" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 *  Brands (filled — stroke geometry would muddy them)
 * ------------------------------------------------------------------ */

export const IconLinkedIn = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.5h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6v5.5h-4v-4.9c0-1.2 0-2.7-1.65-2.7s-1.9 1.3-1.9 2.6v5h-4v-11Z" />
  </Svg>
)

export const IconGitHub = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 *  Chrome
 * ------------------------------------------------------------------ */

export const IconMenu = (p) => (
  <Svg {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Svg>
)

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m3 12 6 6L21 5" />
  </Svg>
)

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 3v18M3 12h18" />
  </Svg>
)

/* Eight-point asterisk — the recurring brutalist motif. */
export const IconAsterisk = (p) => (
  <Svg {...p}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
  </Svg>
)

export const IconGrid = (p) => (
  <Svg {...p}>
    <path d="M2 2h20v20H2zM2 9.3h20M2 14.6h20M9.3 2v20M14.6 2v20" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 *  Skill groups
 * ------------------------------------------------------------------ */

export const IconMonitor = (p) => (
  <Svg {...p}>
    <path d="M2 3h20v13H2zM8 21h8M12 16v5" />
  </Svg>
)

export const IconServer = (p) => (
  <Svg {...p}>
    <path d="M2 3h20v7H2zM2 14h20v7H2zM6 6.5h1M6 17.5h1" />
  </Svg>
)

export const IconCloud = (p) => (
  <Svg {...p}>
    <path d="M6 20h12a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 20Z" />
  </Svg>
)

export const IconDatabase = (p) => (
  <Svg {...p}>
    <path d="M12 2c5 0 9 1.3 9 3s-4 3-9 3-9-1.3-9-3 4-3 9-3ZM3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
  </Svg>
)

export const IconSpark = (p) => (
  <Svg {...p}>
    <path d="M11 2h2v4h-2zM11 18h2v4h-2zM2 11h4v2H2zM18 11h4v2h-4zM5 5l1.4-1.4L9 6.2 7.6 7.6zM15 16.4l1.4-1.4L19 17.6 17.6 19zM19 5l-1.4 1.4L15 6.2l1.4 1.4zM9 15.8 7.6 17.6 5 19l1.4-1.4z" />
    <path d="M12 8l3 4-3 4-3-4z" />
  </Svg>
)

export const IconCompass = (p) => (
  <Svg {...p}>
    <path d="M12 2v20M2 12h20" />
    <path d="m12 7 5 5-5 5-5-5z" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 *  Section / domain icons
 * ------------------------------------------------------------------ */

export const IconZap = (p) => (
  <Svg {...p}>
    <path d="M13 2 4 13h6l-1 9 9-11h-6l1-9Z" />
  </Svg>
)

export const IconLayers = (p) => (
  <Svg {...p}>
    <path d="m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5" />
  </Svg>
)

export const IconTerminal = (p) => (
  <Svg {...p}>
    <path d="M2 3h20v18H2zM6 8l4 4-4 4M13 16h5" />
  </Svg>
)

export const IconCode = (p) => (
  <Svg {...p}>
    <path d="m7 4-5 8 5 8M17 4l5 8-5 8M14 2l-4 20" />
  </Svg>
)

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 2 3 6v7c0 5 4 8 9 9 5-1 9-4 9-9V6l-9-4Z" />
    <path d="m8 12 3 3 5-6" />
  </Svg>
)

export const IconClock = (p) => (
  <Svg {...p}>
    <path d="M12 2v22M2 12h22" />
    <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
  </Svg>
)

export const IconTarget = (p) => (
  <Svg {...p}>
    <path d="M12 2v20M2 12h20" />
    <path d="M17 7h-4v4h4V7ZM11 13H7v4h4v-4Z" />
  </Svg>
)

export const IconSun = (p) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" />
    <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.9 2.9M16.9 16.9l2.9 2.9M19.8 4.2l-2.9 2.9M7.1 16.9l-2.9 2.9" />
  </Svg>
)

export const IconMoon = (p) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </Svg>
)
