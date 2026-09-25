/** Small, dependency-free helpers. */

export const cx = (...parts) => parts.filter(Boolean).join(' ')

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Deterministic PRNG so the particle field is identical on every load. */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** True on devices with a precise pointer (mouse / trackpad). */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

/** Maps a 0–1 scroll/hover value onto a different range. */
export const remap = (v, from, to) => {
  const a = Array.isArray(from) ? from : [from, from + 1]
  const b = Array.isArray(to) ? to : [to, to + 1]
  const [f0, f1] = a
  const [t0, t1] = b
  if (f1 === f0) return t0
  return t0 + ((v - f0) / (f1 - f0)) * (t1 - t0)
}

/** Splits text into words while preserving the spaces for layout. */
export const splitWords = (text = '') => String(text).split(/\s+/).filter(Boolean)
