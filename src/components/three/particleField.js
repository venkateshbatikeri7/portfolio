import * as THREE from 'three'
import { mulberry32 } from '../../lib/utils'

/* ------------------------------------------------------------------ *
 *  Shared GLSL — the drift function must be byte-identical in the
 *  point and line shaders so that lines stay glued to their nodes.
 * ------------------------------------------------------------------ */
const NOISE_GLSL = /* glsl */ `
  float hash11(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;

    float a = mix(
      mix(mix(hash11(n),        hash11(n + 1.0),   f.x),
          mix(hash11(n + 57.0),  hash11(n + 58.0),  f.x), f.y),
      mix(mix(hash11(n + 113.0), hash11(n + 114.0), f.x),
          mix(hash11(n + 170.0), hash11(n + 171.0), f.x), f.y),
      f.z
    );
    return a;
  }
`

const DRIFT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;

  vec3 driftPosition(vec3 p, float seed) {
    float t = uTime * 0.11;
    float e = uEnergy;

    vec3 o;
    o.x = sin(t * 1.30 + seed * 6.2831) * 0.62 * e;
    o.y = cos(t * 1.05 + seed * 12.566) * 0.48 * e;
    o.z = sin(t * 0.85 + seed * 3.1415) * 0.38 * e;

    // Curl-ish swirl from a single octave of value noise.
    float a = vnoise(p * 0.17 + vec3(0.0, 0.0, t)) * 2.0 - 1.0;
    vec3 swirl = vec3(a, -a * 0.62, a * 0.42);
    o += normalize(swirl + 1e-5) * 0.72 * e;

    // Snap the offset to a coarse lattice. The field then advances in hard
    // mechanical steps rather than gliding, which is what sells the look.
    o = floor(o * 6.0 + 0.5) / 6.0;

    return p + o;
  }
`

/* ------------------------------------------------------------------ *
 *  Points
 * ------------------------------------------------------------------ */
const POINT_VERT = /* glsl */ `
  ${NOISE_GLSL}
  ${DRIFT_GLSL}

  attribute float aSeed;
  attribute float aScale;
  attribute float aTint;

  uniform vec2  uMouse;
  uniform float uMouseActive;
  uniform float uScroll;
  uniform float uSize;
  uniform float uAspect;
  uniform float uPixelRatio;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vAlpha;
  varying float vTint;
  varying float vHot;

  void main() {
    vec3 p = driftPosition(position, aSeed);

    // Slow vertical parallax tied to page scroll.
    p.y += uScroll * 5.0;
    // Gentle push away from the viewer as you scroll deeper.
    p.z -= uScroll * 2.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / max(clip.w, 0.0001);

    // Cursor repulsion measured in screen space so it feels 1:1 with the cursor,
    // then converted back into view space so it still has depth.
    vec2 delta = ndc - uMouse;
    vec2 screenDelta = vec2(delta.x * uAspect, delta.y);
    float screenDist = length(screenDelta);
    float influence = smoothstep(0.34, 0.0, screenDist) * uMouseActive;

    if (influence > 0.001) {
      float depthScale = 1.0 / max(-mv.z, 0.05);
      mv.xy += normalize(screenDelta + 1e-5) * -1.0 * influence * 1.15 * depthScale;
      clip = projectionMatrix * mv;
    }

    float depthFade = smoothstep(34.0, 5.0, -mv.z);

    vAlpha  = depthFade * (0.32 + aScale * 0.5) * (1.0 + influence * 1.9);
    vTint   = aTint;
    vHot    = influence;

    gl_Position = clip;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + influence * 1.1) * (18.0 / max(-mv.z, 0.6));
  }
`

const POINT_FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying float vAlpha;
  varying float vTint;
  varying float vHot;

  void main() {
    vec2 a = abs(gl_PointCoord - 0.5);
    float box = max(a.x, a.y);

    // Hard square footprint, flat-filled. No falloff, no halo, no glow.
    if (box > 0.5) discard;

    vec3 col = mix(uColorA, uColorB, smoothstep(0.60, 0.97, vTint));
    col = mix(col, uColorC, step(0.955, vTint) * 0.85);
    col = mix(col, uColorB, vHot * 0.6);

    // Near the cursor a node punches out into a hollow box, like a
    // selection marquee snapping around a target.
    float hollow = step(box, 0.30) * vHot;

    gl_FragColor = vec4(col, vAlpha * (1.0 - hollow));
  }
`

/* ------------------------------------------------------------------ *
 *  Connection lines
 * ------------------------------------------------------------------ */
const LINE_VERT = /* glsl */ `
  ${NOISE_GLSL}
  ${DRIFT_GLSL}

  attribute vec3  aOther;
  attribute float aSeed;
  attribute float aSeedOther;
  attribute float aWhich;
  attribute float aStrength;

  uniform vec2  uMouse;
  uniform float uMouseActive;
  uniform float uScroll;
  uniform float uAspect;
  uniform float uLinkDist;

  varying float vAlpha;
  varying float vHot;

  vec3 offsetFor(vec3 p, float seed) {
    vec3 o = p;
    o.y += uScroll * 5.0;
    o.z -= uScroll * 2.2;
    return o;
  }

  void main() {
    vec3 a = offsetFor(driftPosition(position,   aSeed),      aSeed);
    vec3 b = offsetFor(driftPosition(aOther,    aSeedOther),  aSeedOther);

    // Fade the link out as its endpoints drift apart.
    float gap = distance(a, b);
    float alive = smoothstep(uLinkDist, uLinkDist * 0.16, gap);

    vec3 p = mix(a, b, aWhich);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / max(clip.w, 0.0001);

    vec2 screenDelta = vec2((ndc.x - uMouse.x) * uAspect, ndc.y - uMouse.y);
    float screenDist = length(screenDelta);
    float influence = smoothstep(0.36, 0.0, screenDist) * uMouseActive;

    float depthFade = smoothstep(34.0, 5.0, -mv.z);

    vAlpha = alive * aStrength * depthFade * (0.30 + influence * 1.25);
    vHot   = influence;

    gl_Position = clip;
  }
`

const LINE_FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vAlpha;
  varying float vHot;

  void main() {
    vec3 col = mix(uColorA, uColorB, clamp(vHot * 1.4, 0.0, 1.0));
    gl_FragColor = vec4(col, vAlpha);
  }
`

/* ------------------------------------------------------------------ *
 *  Field generation
 * ------------------------------------------------------------------ */
const BOUNDS = { x: 20, y: 13, z: 11 }

export function buildConstellation({ count = 1100, linkDistance = 2.5, maxLinks = 5, seed = 20260826 } = {}) {
  const rng = mulberry32(seed)
  const half = { x: BOUNDS.x / 2, y: BOUNDS.y / 2, z: BOUNDS.z / 2 }

  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const scales = new Float32Array(count)
  const tints = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // Slight centre bias keeps the field from looking like a flat wall.
    const bx = (rng() * 2 - 1) * 0.94
    const by = (rng() * 2 - 1) * 0.92
    const bz = (rng() * 2 - 1)

    positions[i * 3 + 0] = bx * half.x
    positions[i * 3 + 1] = by * half.y
    positions[i * 3 + 2] = bz * half.z * 0.5

    seeds[i] = rng()
    // A few large "hub" nodes stand out and anchor the composition.
    scales[i] = rng() > 0.9 ? 1.5 + rng() * 1.1 : 0.42 + rng() * 0.72
    tints[i] = Math.pow(rng(), 0.7)
  }

  /* --- Neighbour search via a uniform spatial hash (O(n) not O(n²)) --- */
  const cell = linkDistance
  const buckets = new Map()

  const key = (cx, cy, cz) => `${cx},${cy},${cz}`

  for (let i = 0; i < count; i++) {
    const cx = Math.floor((positions[i * 3] + half.x) / cell) + 1
    const cy = Math.floor((positions[i * 3 + 1] + half.y) / cell) + 1
    const cz = Math.floor((positions[i * 3 + 2] + half.z) / cell) + 1
    const k = key(cx, cy, cz)
    let list = buckets.get(k)
    if (!list) buckets.set(k, (list = []))
    list.push(i)
  }

  const linePos = []
  const lineOther = []
  const lineSeed = []
  const lineSeedOther = []
  const lineWhich = []
  const lineStrength = []

  const maxD2 = linkDistance * linkDistance

  for (let i = 0; i < count; i++) {
    const px = positions[i * 3]
    const py = positions[i * 3 + 1]
    const pz = positions[i * 3 + 2]
    const cx = Math.floor((px + half.x) / cell) + 1
    const cy = Math.floor((py + half.y) / cell) + 1
    const cz = Math.floor((pz + half.z) / cell) + 1

    let made = 0

    for (let ox = -1; ox <= 1 && made < maxLinks; ox++) {
      for (let oy = -1; oy <= 1 && made < maxLinks; oy++) {
        for (let oz = -1; oz <= 1 && made < maxLinks; oz++) {
          const list = buckets.get(key(cx + ox, cy + oy, cz + oz))
          if (!list) continue

          for (let n = 0; n < list.length && made < maxLinks; n++) {
            const j = list[n]
            if (j <= i) continue

            const dx = positions[j * 3] - px
            const dy = positions[j * 3 + 1] - py
            const dz = positions[j * 3 + 2] - pz
            const d2 = dx * dx + dy * dy + dz * dz
            if (d2 > maxD2 || d2 === 0) continue

            const t = 1 - Math.sqrt(d2) / linkDistance
            const strength = 0.14 + t * t * 0.86

            // Endpoint A
            linePos.push(px, py, pz)
            lineOther.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
            lineSeed.push(seeds[i])
            lineSeedOther.push(seeds[j])
            lineWhich.push(0)
            lineStrength.push(strength)

            // Endpoint B
            linePos.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
            lineOther.push(px, py, pz)
            lineSeed.push(seeds[j])
            lineSeedOther.push(seeds[i])
            lineWhich.push(1)
            lineStrength.push(strength)

            made++
          }
        }
      }
    }
  }

  const pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointsGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  pointsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  pointsGeometry.setAttribute('aTint', new THREE.BufferAttribute(tints, 1))
  // Fixed, generous bounds — the drift happens on the GPU.
  pointsGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60)

  const linesGeometry = new THREE.BufferGeometry()
  linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
  linesGeometry.setAttribute('aOther', new THREE.Float32BufferAttribute(lineOther, 3))
  linesGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(lineSeed, 1))
  linesGeometry.setAttribute('aSeedOther', new THREE.Float32BufferAttribute(lineSeedOther, 1))
  linesGeometry.setAttribute('aWhich', new THREE.Float32BufferAttribute(lineWhich, 1))
  linesGeometry.setAttribute('aStrength', new THREE.Float32BufferAttribute(lineStrength, 1))
  linesGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60)

  return {
    pointsGeometry,
    linesGeometry,
    linkDistance,
    stats: { nodes: count, links: linePos.length / 6 },
  }
}

export const constellationMaterials = () => ({
  pointUniforms: {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseActive: { value: 0 },
    uScroll: { value: 0 },
    uSize: { value: 1.9 },
    uAspect: { value: 1 },
    uPixelRatio: { value: 1 },
    /* Injected from the CSS custom properties so the field retints with the theme. */
    uColorA: { value: new THREE.Color('#dfff00') },
    uColorB: { value: new THREE.Color('#f4f4ee') },
    uColorC: { value: new THREE.Color('#ff3b1f') },
  },
  lineUniforms: {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uMouseActive: { value: 0 },
    uScroll: { value: 0 },
    uAspect: { value: 1 },
    uLinkDist: { value: 2.5 },
    uColorA: { value: new THREE.Color('#4a5c00') },
    uColorB: { value: new THREE.Color('#6e8200') },
  },
  vertex: POINT_VERT,
  fragment: POINT_FRAG,
  lineVertex: LINE_VERT,
  lineFragment: LINE_FRAG,
})
