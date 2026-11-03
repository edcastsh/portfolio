import { useEffect, useRef, useState } from 'react'
import { Blobatar } from '@blobatar/react'
import { useGaze } from '@blobatar/react/gaze'
import { HintBubble } from './HintBubble'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useHints } from '../hooks/useHints'
import 'blobatar/gaze.css'
import 'blobatar/motion.css'

const SIZE = 84
const PADDING = 24
const LERP = 0.12
const TRANSITION_MS = 500

type Point = { x: number; y: number }
type Edge = 'top' | 'bottom' | 'left' | 'right'
type Phase = 'idle' | 'exiting' | 'moving' | 'entering'

const EDGES: Edge[] = ['bottom', 'right', 'top', 'left']

function getWindowSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

function getScrollProgress() {
  if (typeof window === 'undefined') return 0
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  if (scrollHeight <= 0) return 0
  return window.scrollY / scrollHeight
}

function getEdgeAndProgress(progress: number) {
  const scaled = progress * EDGES.length
  const index = Math.min(EDGES.length - 1, Math.floor(scaled))
  const local = scaled - index
  return { edge: EDGES[index], local }
}

function getVisibleOffset(edge: Edge, local: number, width: number, height: number): Point {
  const hSpan = Math.max(0, width - SIZE - PADDING * 2)
  const vSpan = Math.max(0, height - SIZE - PADDING * 2)
  switch (edge) {
    case 'bottom':
      return { x: PADDING + local * hSpan, y: height - SIZE - PADDING }
    case 'right':
      return { x: width - SIZE - PADDING, y: PADDING + (1 - local) * vSpan }
    case 'top':
      return { x: PADDING + (1 - local) * hSpan, y: PADDING }
    case 'left':
      return { x: PADDING, y: PADDING + local * vSpan }
  }
}

function getHiddenOffset(edge: Edge, local: number, width: number, height: number): Point {
  const visible = getVisibleOffset(edge, local, width, height)
  switch (edge) {
    case 'bottom':
      return { x: visible.x, y: height }
    case 'right':
      return { x: width, y: visible.y }
    case 'top':
      return { x: visible.x, y: -SIZE }
    case 'left':
      return { x: -SIZE, y: visible.y }
  }
}

function edgeFromOffset(offset: Point, width: number, height: number): Edge {
  if (offset.y >= height - SIZE - PADDING - 1) return 'bottom'
  if (offset.y <= PADDING + 1) return 'top'
  if (offset.x >= width - SIZE - PADDING - 1) return 'right'
  return 'left'
}

type BlobatarFaceProps = {
  name: string
  size: number
}

function AnimatedBlobatar({ name, size }: BlobatarFaceProps) {
  const { ref, lookAt } = useGaze({ travel: 3 })

  useEffect(() => {
    lookAt('pointer')
  }, [lookAt])

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        lookAt({ x: touch.clientX, y: touch.clientY })
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => window.removeEventListener('touchmove', handleTouchMove)
  }, [lookAt])

  return <Blobatar ref={ref} animate="always" name={name} size={size} title="Floating avatar" />
}

function StaticBlobatar({ name, size }: BlobatarFaceProps) {
  return <Blobatar name={name} size={size} title="Avatar" />
}

export function FloatingBlobatar() {
  const reduced = useReducedMotion()
  const { hint, visible: hintVisible } = useHints()
  const [name] = useState(() => `visitor-${Math.random().toString(36).slice(2)}`)

  const initialScroll = getEdgeAndProgress(getScrollProgress())
  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [displayEdge, setDisplayEdge] = useState<Edge>(initialScroll.edge)
  const [phase, setPhase] = useState<Phase>('moving')
  const [offset, setOffset] = useState<Point>(
    getHiddenOffset(initialScroll.edge, initialScroll.local, window.innerWidth, window.innerHeight)
  )

  const displayEdgeRef = useRef(displayEdge)
  const phaseRef = useRef(phase)
  const localRef = useRef(initialScroll.local)
  const sizeRef = useRef(windowSize)

  useEffect(() => {
    displayEdgeRef.current = displayEdge
  }, [displayEdge])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    sizeRef.current = windowSize
  }, [windowSize])

  const startTransition = (nextEdge: Edge, nextLocal: number) => {
    if (phaseRef.current !== 'idle' && phaseRef.current !== 'entering') return

    const currentEdge = displayEdgeRef.current
    const currentLocal = localRef.current
    const { width, height } = sizeRef.current

    phaseRef.current = 'exiting'
    setPhase('exiting')
    setOffset(getHiddenOffset(currentEdge, currentLocal, width, height))

    setTimeout(() => {
      displayEdgeRef.current = nextEdge
      setDisplayEdge(nextEdge)
      localRef.current = nextLocal

      const hiddenNext = getHiddenOffset(nextEdge, nextLocal, width, height)
      setOffset(hiddenNext)
      setPhase('moving')

      requestAnimationFrame(() => {
        setPhase('entering')
        setOffset(getVisibleOffset(nextEdge, nextLocal, width, height))

        setTimeout(() => {
          setPhase('idle')
        }, TRANSITION_MS)
      })
    }, TRANSITION_MS)
  }

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (reduced) return

    const { width, height } = getWindowSize()
    const edge = displayEdgeRef.current
    const local = localRef.current

    const enterTimer = setTimeout(() => {
      setPhase('entering')
      setOffset(getVisibleOffset(edge, local, width, height))
      const idleTimer = setTimeout(() => setPhase('idle'), TRANSITION_MS)
      return () => clearTimeout(idleTimer)
    }, 50)

    return () => clearTimeout(enterTimer)
  }, [reduced])

  useEffect(() => {
    if (reduced) return

    let raf: number
    const loop = () => {
      const { edge: targetEdge, local } = getEdgeAndProgress(getScrollProgress())
      const { width, height } = sizeRef.current
      const currentPhase = phaseRef.current

      if (currentPhase === 'idle' || currentPhase === 'entering') {
        if (targetEdge !== displayEdgeRef.current) {
          startTransition(targetEdge, local)
        } else {
          localRef.current = local
          const target = getVisibleOffset(displayEdgeRef.current, local, width, height)
          setOffset((prev) => {
            const dx = target.x - prev.x
            const dy = target.y - prev.y
            return { x: prev.x + dx * LERP, y: prev.y + dy * LERP }
          })
        }
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="floating-blobatar floating-blobatar--reduced"
        style={{
          width: SIZE,
          height: SIZE,
          transform: `translate3d(${windowSize.width - SIZE - PADDING}px, ${windowSize.height - SIZE - PADDING}px, 0)`,
        }}
      >
        <StaticBlobatar name={name} size={SIZE} />
        {hint && <HintBubble edge="left" message={hint} visible={hintVisible} />}
      </div>
    )
  }

  const edge = edgeFromOffset(offset, windowSize.width, windowSize.height)
  const transition =
    phase === 'moving' ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`

  return (
    <div
      aria-hidden="true"
      className="floating-blobatar"
      style={{
        width: SIZE,
        height: SIZE,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition,
      }}
    >
      <AnimatedBlobatar name={name} size={SIZE} />
      {hint && <HintBubble edge={edge} message={hint} visible={hintVisible} />}
    </div>
  )
}
