'use client'

import { useState, useEffect } from 'react'

export const USER_AVATAR_COLORS = [
  '#5B6CC8', '#3D9BE9', '#27B08B', '#5BAD7A',
  '#E8834A', '#D9547E', '#9B5DC0', '#6E8F9E',
]

const STORAGE_KEY = 'user-avatar-color'
const UPDATE_EVENT = 'user-avatar-updated'

export function setUserAvatarColor(color: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, color)
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function getUserAvatarColor(): string {
  if (typeof window === 'undefined') return USER_AVATAR_COLORS[0]
  return localStorage.getItem(STORAGE_KEY) ?? USER_AVATAR_COLORS[0]
}

export function UserAvatar({ size = 32 }: { size?: number }) {
  const [color, setColor] = useState(USER_AVATAR_COLORS[0])

  useEffect(() => {
    setColor(getUserAvatarColor())
    const handler = () => setColor(getUserAvatarColor())
    window.addEventListener(UPDATE_EVENT, handler)
    return () => window.removeEventListener(UPDATE_EVENT, handler)
  }, [])

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: Math.max(10, Math.round(size * 0.38)),
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      我
    </div>
  )
}
