import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function getPersonalityType(personality: string): string {
  try {
    const p = JSON.parse(personality)
    return p.type || 'intellectual'
  } catch {
    return 'intellectual'
  }
}

export function getPersonalityTraits(personality: string): string[] {
  try {
    const p = JSON.parse(personality)
    return p.traits || []
  } catch {
    return []
  }
}

export function calculateTypingDelay(message: string): number {
  const chars = message.length
  const delay = chars * 50
  return Math.min(Math.max(delay, 1000), 4000)
}

export function getAvatarGradient(name: string): string {
  const gradients: Record<string, string> = {
    Luna: 'from-violet-600 to-indigo-600',
    Kai: 'from-orange-500 to-pink-600',
    Aria: 'from-cyan-500 to-blue-600',
    Nox: 'from-gray-700 to-slate-900',
  }
  return gradients[name] || 'from-purple-600 to-pink-600'
}

export function getAvatarEmoji(name: string): string {
  const emojis: Record<string, string> = {
    Luna: '🌙',
    Kai: '⚡',
    Aria: '💙',
    Nox: '🌑',
  }
  return emojis[name] || '✨'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
