import { useEffect, useRef, useCallback } from 'react'

const IDLE_TIMEOUT_MS = 30 * 60 * 1000
const THROTTLE_MS = 1000

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
]

/**
 * Monitors user activity and fires `onIdle` after 30 minutes of inactivity.
 * Automatically attaches/detaches DOM listeners based on `enabled`.
 */
export default function useIdleTimer(onIdle, enabled = true) {
  const onIdleRef = useRef(onIdle)
  onIdleRef.current = onIdle

  const timerRef = useRef(null)
  const throttleRef = useRef(false)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onIdleRef.current(), IDLE_TIMEOUT_MS)
  }, [])

  const handleActivity = useCallback(() => {
    if (throttleRef.current) return
    throttleRef.current = true
    setTimeout(() => { throttleRef.current = false }, THROTTLE_MS)
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    resetTimer()

    ACTIVITY_EVENTS.forEach(evt =>
      window.addEventListener(evt, handleActivity, { passive: true })
    )

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach(evt =>
        window.removeEventListener(evt, handleActivity)
      )
    }
  }, [enabled, handleActivity, resetTimer])
}
