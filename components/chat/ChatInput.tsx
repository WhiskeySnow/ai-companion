'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Mic, ImagePlus, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Message...' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="flex items-end gap-2 p-3 bg-background-secondary/80 backdrop-blur-md border-t border-white/5">
      {/* Voice button — stub */}
      <button
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all"
        onClick={() => alert('Voice messages coming soon!')}
        type="button"
        title="Voice message (coming soon)"
      >
        <Mic size={18} />
      </button>

      {/* Image button — stub */}
      <button
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all"
        onClick={() => alert('Image sharing coming soon!')}
        type="button"
        title="Send image (coming soon)"
      >
        <ImagePlus size={18} />
      </button>

      {/* Text input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full bg-white/8 border border-white/10 rounded-2xl px-4 py-2.5',
            'text-white text-sm placeholder:text-white/30',
            'resize-none overflow-hidden leading-relaxed',
            'focus:outline-none focus:border-accent-purple/50 focus:bg-white/10',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[40px] max-h-[120px]'
          )}
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        type="button"
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
          'transition-all duration-200',
          canSend
            ? 'bg-gradient-to-br from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/30 hover:opacity-90 scale-100'
            : 'bg-white/8 text-white/25 cursor-not-allowed'
        )}
      >
        <Send size={16} />
      </button>
    </div>
  )
}
