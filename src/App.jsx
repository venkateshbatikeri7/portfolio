import { lazy, Suspense, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { EASE } from './lib/motion'

const Backdrop = lazy(() => import('./components/Backdrop'))
const Nav = lazy(() => import('./components/Nav'))
const Cursor = lazy(() => import('./components/ui/Cursor'))
const Preloader = lazy(() => import('./components/ui/Preloader'))
const Hero = lazy(() => import('./components/sections/Hero'))
const Manifesto = lazy(() => import('./components/sections/Manifesto'))
const About = lazy(() => import('./components/sections/About'))
const Experience = lazy(() => import('./components/sections/Experience'))
const Projects = lazy(() => import('./components/sections/Projects'))
const Stack = lazy(() => import('./components/sections/Stack'))
const Contact = lazy(() => import('./components/sections/Contact'))

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.7, ease: EASE.outExpo }}
      >
        <Suspense fallback={null}>
          <Preloader onDone={() => setReady(true)} />
          <Backdrop />
          <Cursor />
        </Suspense>

        <Nav />

        <LazySection>
          <Hero ready={ready} />
        </LazySection>
        <LazySection>
          <Manifesto />
        </LazySection>
        <LazySection>
          <About />
        </LazySection>
        <LazySection>
          <Experience />
        </LazySection>
        <LazySection>
          <Projects />
        </LazySection>
        <LazySection>
          <Stack />
        </LazySection>
        <LazySection>
          <Contact />
        </LazySection>
      </MotionConfig>
    </LazyMotion>
  )
}

/** Keeps each section off the critical path without breaking scroll-linked layout. */
function LazySection({ children }) {
  return <Suspense fallback={<div className="min-h-[60vh]" />}>{children}</Suspense>
}
