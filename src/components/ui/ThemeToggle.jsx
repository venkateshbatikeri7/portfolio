import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { IconMoon, IconSun } from './Icons'

const STORAGE_KEY = 'portfolio-theme'

/**
 * Reads the theme already applied to <html> by the inline boot script in
 * index.html. Deriving state from the DOM (rather than re-reading
 * localStorage) keeps React in step with what the user is actually looking at.
 */
function currentTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'light') {
    root.dataset.theme = 'light'
  } else {
    // Dark is the default, so it is represented by the absence of the attribute.
    delete root.dataset.theme
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Private mode / storage disabled — the in-memory switch still works.
  }
  // Keep the browser chrome in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'light' ? '#e9e9e0' : '#0a0a0a')
}

/**
 * Hard-edged theme switch: a bordered square that fills with acid and shows
 * the theme you are switching *to*. Deliberately not a smooth cross-fade —
 * the whole page re-tints instantly, which is the brutalist idiom.
 */
export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(currentTheme)

  // Follow changes made elsewhere (e.g. another tab) without owning them.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setTheme(currentTheme())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <m.button
      type="button"
      onClick={() => {
        setTheme(next)
        applyTheme(next)
      }}
      className={`grid h-10 w-10 place-items-center border-2 border-ash-600 text-bone-mute transition-colors duration-150 hover:border-acid hover:bg-acid-fill hover:text-on-acid ${className}`}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      aria-pressed={theme === 'light'}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15, ease: EASE.hard }}
      data-cursor="hover"
      data-cursor-label={next.toUpperCase()}
    >
      {/* Keyed swap so the glyph hard-cuts between states. */}
      <m.span
        key={theme}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.2, ease: EASE.hard }}
        className="grid place-items-center"
      >
        {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
      </m.span>
    </m.button>
  )
}
