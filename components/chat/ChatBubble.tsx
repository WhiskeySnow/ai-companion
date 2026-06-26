'use client'

import { Avatar } from '@/components/ui/Avatar'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  characterName?: string
  timestamp?: Date | string
  showAvatar?: boolean
}

export function ChatBubble({ role, content, characterName, timestamp, showAvatar = true }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex items-end gap-2 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {!isUser && showAvatar && characterName && (
        <div className="flex-shrink-0 mb-1">
          <Avatar name={characterName} size="sm" />
        </div>
      )}
      {isUser && <div className="w-8 flex-shrink-0" />}

      {/* Bubble */}
      <div className={cn('max-w-[75%] flex flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-gradient-to-br from-accent-purple to-accent-pink text-white rounded-br-sm'
              : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/5'
          )}
        >
          {content}
        </div>

        {timestamp && (
          <span className="text-[10px] text-white/30 mt-1 px-1">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}
