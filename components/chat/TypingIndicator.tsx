'use client'

import { Avatar } from '@/components/ui/Avatar'

interface TypingIndicatorProps {
  characterName: string
}

export function TypingIndicator({ characterName }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <Avatar name={characterName} size="sm" />
      <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-white/50"
            style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-white/50"
            style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '200ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-white/50"
            style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '400ms' }}
          />
        </div>
      </div>
    </div>
  )
}
