import { lazy, Suspense, useEffect, useRef } from 'react'
import { m, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

const ConstellationCanvas = lazy(() => import('./three/ConstellationCanvas'))

/**
 * Fixed full-viewport backdrop. The aurora wash is gone: what remains is
 * structural — a printed engineering grid, a hard scan bar and registration
 * ticks — with the WebGL constellation sitting on top as the only moving part.
 */
export default function AuroraBackdrop() {
  const scrollYProgress = useScroll().scrollYProgress
  const scrollRef = useRef(0)
  const ruleTop = useTransform(scrollYProgress, (v) => `${(v * 100).toFixed(2)}%`)
  const pointer = useRef({ x: 0, y: 0 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollRef.current = v
  })

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ash-900">
      {/* Printed grid — flat, no gradient, no blur */}
      <div className="grid-field-lg absolute inset-0" />

      {/* Corner registration ticks */}
      <span className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-acid/50 md:left-6 md:top-6" />
      <span className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-acid/50 md:bottom-6 md:right-6" />

      {/* The constellation itself */}
      <Suspense fallback={null}>
        <ConstellationCanvas className="absolute inset-0" scrollProgress={scrollRef} pointer={pointer} />
      </Suspense>

      {/* A hard acid rule that tracks page scroll — the one bright horizontal */}
      <m.div
        className="absolute inset-x-0 h-px bg-acid/25"
        style={{ top: ruleTop }}
        aria-hidden="true"
      />

      {/* Slow vertical scan bar, the only ambient motion in the backdrop */}
      <div
        className="animate-scan absolute inset-x-0 h-[22vh] bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--c-acid)_5%,transparent),transparent)]"
        aria-hidden="true"
      />

      {/* Coarse hatch band along the bottom edge, to close the composition */}
      <div className="hatch absolute inset-x-0 bottom-0 h-1 opacity-25" aria-hidden="true" />
    </div>
  )
}
