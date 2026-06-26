'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

export function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // slide in
    const t1 = setTimeout(() => setVisible(true), 10)
    // slide out after 2s
    const t2 = setTimeout(() => setVisible(false), 2000)
    // remove after animation
    const t3 = setTimeout(() => onDone(), 2350)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 0.25s ease, opacity 0.25s ease',
      background: 'rgba(0,0,0,0.72)',
      color: '#fff',
      padding: '8px 18px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 500,
      zIndex: 9999,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}

// Hook for easy toast usage
import { useCallback, useRef } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const counterRef = useRef(0)

  const showToast = useCallback((message: string) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, message }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const ToastContainer = () => (
    <>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onDone={() => removeToast(t.id)} />
      ))}
    </>
  )

  return { showToast, ToastContainer }
}
