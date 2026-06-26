'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { ChatInput } from '@/components/chat/ChatInput'
import { calculateTypingDelay } from '@/lib/utils'
import { ChevronLeft, Phone, Info } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  characterId?: string | null
}

interface Character {
  id: string
  name: string
  bio: string
  avatar?: string | null
  personality: string
  aiProvider: string
}

export default function ChatPage({ params }: { params: { characterId: string } }) {
  const { characterId } = params
  const [character, setCharacter] = useState<Character | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom
  function scrollToBottom(smooth = true) {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }

  // Load conversation
  useEffect(() => {
    async function loadConversation() {
      try {
        const res = await fetch(`/api/chat/${characterId}`)
        if (!res.ok) throw new Error('Failed to load conversation')
        const data = await res.json()
        setCharacter(data.character)
        setMessages(data.messages)
        setTimeout(() => scrollToBottom(false), 100)
      } catch (err) {
        setError('Could not load conversation. Make sure the database is set up.')
      } finally {
        setLoading(false)
      }
    }
    loadConversation()
  }, [characterId])

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  async function handleSend(content: string) {
    if (!character || isTyping) return

    // Optimistically add user message
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      characterId: null,
    }
    setMessages(prev => [...prev, userMsg])

    // Show typing indicator after a tiny delay
    setIsTyping(true)

    try {
      const res = await fetch(`/api/chat/${characterId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      if (!res.ok) throw new Error('Failed to send message')
      const data = await res.json()

      // The API already waited for the typing delay, just apply it here too
      // for consistent UX even on fast responses
      const delay = calculateTypingDelay(data.response.content)
      await new Promise(resolve => setTimeout(resolve, Math.max(0, delay - 500)))

      setIsTyping(false)
      setMessages(data.messages)
    } catch (err) {
      console.error(err)
      setIsTyping(false)
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
      alert('Failed to send message. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">💫</div>
          <h2 className="text-lg font-semibold text-white mb-2">Character not found</h2>
          <p className="text-white/40 text-sm mb-4">{error || 'This character doesn\'t exist.'}</p>
          <p className="text-white/30 text-xs mb-4">Make sure you ran: npx prisma db seed</p>
          <Link href="/characters" className="text-accent-purple-light hover:text-accent-pink transition-colors text-sm">
            Browse characters
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-56px)]">
      {/* Chat header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-background-secondary/90 backdrop-blur-md border-b border-white/5">
        <Link
          href="/characters"
          className="flex-shrink-0 w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all"
        >
          <ChevronLeft size={20} className="text-white/60" />
        </Link>

        <Link href={`/characters/${character.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
          <Avatar name={character.name} size="md" online={true} />
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm group-hover:text-accent-purple-light transition-colors">
              {character.name}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Active now
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => alert('Voice calls coming soon with ElevenLabs integration!')}
            className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all text-white/40 hover:text-white/70"
            title="Voice call (coming soon)"
          >
            <Phone size={18} />
          </button>
          <Link
            href={`/characters/${character.id}`}
            className="w-9 h-9 rounded-xl hover:bg-white/8 flex items-center justify-center transition-all text-white/40 hover:text-white/70"
          >
            <Info size={18} />
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {/* Empty state */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
            <div className="story-ring">
              <div className="bg-background p-1 rounded-full">
                <Avatar name={character.name} size="xl" />
              </div>
            </div>
            <div className="text-center max-w-xs">
              <h3 className="font-semibold text-white text-lg mb-1">{character.name}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{character.bio}</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/8 text-white/30 text-xs">
              Send a message to start the conversation
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1]
          const showAvatar = msg.role === 'assistant' && (
            !prevMsg || prevMsg.role !== 'assistant'
          )

          return (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              characterName={character.name}
              timestamp={msg.createdAt}
              showAvatar={showAvatar}
            />
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <TypingIndicator characterName={character.name} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0">
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          placeholder={`Message ${character.name}...`}
        />
      </div>
    </div>
  )
}
