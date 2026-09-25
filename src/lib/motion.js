/** Shared easing curves — kept as data so variants stay declarative.
 *  `hard` is the default for brutalist work: decisive, no overshoot. */
export const EASE = {
  hard: [0.85, 0, 0.15, 1],
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  outBack: [0.34, 1.56, 0.64, 1],
}

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 380, damping: 32, mass: 0.7 },
  gentle: { type: 'spring', stiffness: 70, damping: 18 },
}

/** Parent orchestration for staggered reveals. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
})

/** Standard "rise into place" for a block of content. No blur — it reads soft. */
export const riseIn = (distance = 28) => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.hard },
  },
})

/** Word-by-word mask reveal, used for headlines. */
export const wordUp = {
  hidden: { y: '115%', opacity: 0 },
  show: (i = 0) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASE.hard,
      delay: 0.05 * i,
    },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE.hard } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE.hard } },
}

/** Standard viewport config so every section reveals at the same moment. */
export const inViewOnce = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' }
export const inViewSoft = { once: true, amount: 0.15, margin: '0px 0px -8% 0px' }
