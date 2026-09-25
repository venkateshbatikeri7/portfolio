import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildConstellation, constellationMaterials } from './particleField'

/** Link radius in world units. Must be in scope before the field memo reads it. */
const LINK_DISTANCE = 2.5

/* ------------------------------------------------------------------ *
 *  Field — owns the geometry, materials and the per-frame GPU updates.
 * ------------------------------------------------------------------ */
function Field({ scrollProgress, pointer, quality }) {
  const { size, viewport } = useThree()
  const aspect = size.width / Math.max(size.height, 1)
  const pixelRatio = Math.min(viewport.dpr, 2)

  const { pointsGeometry, linesGeometry, linkDistance, stats } = useMemo(
    () =>
      buildConstellation({
        count: quality.points,
        linkDistance: LINK_DISTANCE,
        maxLinks: quality.links,
      }),
    [quality],
  )

  /* Uniform objects are rebuilt only when the viewport metrics change, so the
     per-frame loop below can write to them without triggering a React render. */
  const shaders = useMemo(() => {
    const created = constellationMaterials()
    created.lineUniforms.uLinkDist.value = linkDistance
    return created
  }, [linkDistance])

  /*
   * The two suppressions below cover shader-uniform writes.
   * Uniforms are plain mutable objects owned by three.js, not React state.
   * They are written on resize and on every animation frame, which is the
   * intended pattern; routing them through state would re-render at 60fps.
   */

  /* oxlint-disable react/immutability */
  const { pointUniforms, lineUniforms } = shaders

  // Size-dependent uniforms are synced imperatively — three.js reads them at
  // draw time, so this is equivalent to (and cheaper than) remounting materials.
  useEffect(() => {
    pointUniforms.uAspect.value = aspect
    lineUniforms.uAspect.value = aspect
    pointUniforms.uPixelRatio.value = pixelRatio
  }, [pointUniforms, lineUniforms, aspect, pixelRatio])

  /* Pull the palette out of the CSS custom properties so the field follows the
     light/dark theme. `--color-acid` / `--color-bone` / `--color-signal-red`
     resolve through to the active theme's values. */
  useEffect(() => {
    const read = () => {
      const css = getComputedStyle(document.documentElement)
      const pick = (name, fallback) => css.getPropertyValue(name).trim() || fallback

      pointUniforms.uColorA.value.set(pick('--color-acid', '#dfff00'))
      pointUniforms.uColorB.value.set(pick('--color-bone', '#f4f4ee'))
      pointUniforms.uColorC.value.set(pick('--color-signal-red', '#ff3b1f'))
      lineUniforms.uColorA.value.set(pick('--color-acid-deep', '#8ea500'))
      lineUniforms.uColorB.value.set(pick('--color-acid', '#dfff00'))
    }

    read()
    // data-theme is swapped on <html> with no transition, so observe it.
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [pointUniforms, lineUniforms])

  const pointMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: pointUniforms,
        vertexShader: shaders.vertex,
        fragmentShader: shaders.fragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        // Normal blending: additive is what produced the soft neon glow, and
        // the whole point of this pass is to get rid of it.
        blending: THREE.NormalBlending,
      }),
    [pointUniforms, shaders],
  )

  const lineMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: lineUniforms,
        vertexShader: shaders.lineVertex,
        fragmentShader: shaders.lineFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
      }),
    [lineUniforms, shaders],
  )

  useEffect(
    () => () => {
      pointMat.dispose()
      lineMat.dispose()
      pointsGeometry.dispose()
      linesGeometry.dispose()
    },
    [pointMat, lineMat, pointsGeometry, linesGeometry],
  )

  const smoothPointer = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const activity = useRef(0)

  /* oxlint-enable react/immutability */

  /* oxlint-disable react/immutability */
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    const p = pointUniforms
    const l = lineUniforms

    // Ease the cursor so the field feels weighted rather than glued to the mouse.
    const targetX = pointer.current.x
    const targetY = pointer.current.y
    smoothPointer.current.x += (targetX - smoothPointer.current.x) * Math.min(1, d * 3.4)
    smoothPointer.current.y += (targetY - smoothPointer.current.y) * Math.min(1, d * 3.4)

    // Ramp the interaction effect in/out so it never pops.
    const near = Math.abs(targetX) < 1.6 && Math.abs(targetY) < 1.6
    activity.current += ((near ? 1 : 0) - activity.current) * Math.min(1, d * 2.2)

    p.uMouse.value.set(smoothPointer.current.x, smoothPointer.current.y)
    l.uMouse.value.set(smoothPointer.current.x, smoothPointer.current.y)
    p.uMouseActive.value = activity.current
    l.uMouseActive.value = activity.current

    // Scrolling ramps the field's energy, so the background "wakes up" as you move.
    const sc = scrollProgress.current
    scrollRef.current += (sc - scrollRef.current) * Math.min(1, d * 5)
    p.uScroll.value = scrollRef.current
    l.uScroll.value = scrollRef.current

    p.uTime.value = t
    l.uTime.value = t

    const energy = 0.85 + scrollRef.current * 0.85 + activity.current * 0.35
    p.uEnergy.value = energy
    l.uEnergy.value = energy

    // Parallax the whole field against the cursor.
    state.camera.position.x += (smoothPointer.current.x * 1.5 - state.camera.position.x) * Math.min(1, d * 1.6)
    state.camera.position.y += (smoothPointer.current.y * 0.9 - state.camera.position.y) * Math.min(1, d * 1.6)
    state.camera.lookAt(0, scrollRef.current * -1.6, 0)
  })
  /* oxlint-enable react/immutability */

  return (
    <>
      <points frustumCulled={false} geometry={pointsGeometry} material={pointMat} renderOrder={1} />
      <lineSegments frustumCulled={false} geometry={linesGeometry} material={lineMat} renderOrder={0} />
      <FieldReport stats={stats} />
    </>
  )
}

/** Dev-only visibility into the generated field. */
function FieldReport({ stats }) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(`[constellation] ${stats.nodes} nodes · ${stats.links} links`)
    }
  }, [stats])
  return null
}

/* ------------------------------------------------------------------ *
 *  Scene
 * ------------------------------------------------------------------ */
export default function ConstellationCanvas({ scrollProgress, pointer, className }) {
  const quality = useMemo(() => {
    const wide = typeof window !== 'undefined' && window.innerWidth >= 1024
    const dense = wide && (window.devicePixelRatio ?? 1) <= 2.5
    return {
      points: dense ? 1250 : wide ? 850 : 420,
      links: dense ? 5 : 4,
    }
  }, [])

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        camera={{ position: [0, 0, 15], fov: 55, near: 0.1, far: 90 }}
        style={{ position: 'absolute', inset: 0 }}
        frameloop="always"
      >
        <Field scrollProgress={scrollProgress} pointer={pointer} quality={quality} />
      </Canvas>
    </div>
  )
}
