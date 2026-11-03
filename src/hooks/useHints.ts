import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'portfolio-visit-v1'

const VISIBLE_MS = 6000
const PAUSE_MIN_MS = 9000
const PAUSE_MAX_MS = 11000

type VisitRecord = {
  count: number
  lastVisit: string
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(items: T[], avoid?: T | null): T {
  if (items.length <= 1) return items[0]
  let picked = items[Math.floor(Math.random() * items.length)]
  while (avoid && picked === avoid) {
    picked = items[Math.floor(Math.random() * items.length)]
  }
  return picked
}

export function useHints() {
  const { t } = useTranslation()

  const [hint, setHint] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null

    const raw = localStorage.getItem(STORAGE_KEY)
    let record: VisitRecord
    if (raw) {
      const parsed = JSON.parse(raw) as VisitRecord
      record = { count: parsed.count + 1, lastVisit: new Date().toISOString() }
    } else {
      record = { count: 1, lastVisit: new Date().toISOString() }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))

    const welcome =
      record.count > 1
        ? (t('hints.returning', { returnObjects: true }) as string[])
        : (t('hints.first', { returnObjects: true }) as string[])
    return pickRandom(welcome)
  })

  const [visible, setVisible] = useState(false)
  const currentRef = useRef(hint)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    currentRef.current = hint
  }, [hint])

  const showNext = useCallback(() => {
    const all = t('hints.all', { returnObjects: true }) as string[]
    const next = pickRandom(all, currentRef.current)
    currentRef.current = next
    setHint(next)
  }, [t])

  useEffect(() => {
    if (!hint || timeoutRef.current !== null) return

    const cycle = () => {
      setVisible(true)
      timeoutRef.current = window.setTimeout(() => {
        setVisible(false)
        timeoutRef.current = window.setTimeout(
          () => {
            showNext()
            cycle()
          },
          randomBetween(PAUSE_MIN_MS, PAUSE_MAX_MS)
        )
      }, VISIBLE_MS)
    }

    timeoutRef.current = window.setTimeout(cycle, 500)
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [hint, showNext])

  return { hint, visible }
}
