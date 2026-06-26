'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { getPersonalityTraits, truncate, getAvatarGradient } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

interface Character {
  id: string
  name: string
  avatar?: string | null
  bio: string
  personality: string
  aiProvider: string
}

interface CharacterCardProps {
  character: Character
  compact?: boolean
}

const personalityColors: Record<string, string> = {
  intellectual: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  playful: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  supportive: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  mysterious: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  creative: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
}

export function CharacterCard({ character, compact = false }: CharacterCardProps) {
  const traits = getPersonalityTraits(character.personality)
  let personalityType = 'intellectual'
  try {
    const p = JSON.parse(character.personality)
    personalityType = p.type || 'intellectual'
  } catch {}

  const typeColor = personalityColors[personalityType] || personalityColors.intellectual
  const gradient = getAvatarGradient(character.name)

  if (compact) {
    return (
      <Link href={`/chat/${character.id}`} className="block group">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
          <Avatar name={character.name} size="md" online={true} />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white text-sm">{character.name}</div>
            <div className="text-white/40 text-xs truncate">{truncate(character.bio, 40)}</div>
          </div>
          <MessageCircle size={16} className="text-white/20 group-hover:text-accent-purple transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/characters/${character.id}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6 transition-all duration-300 cursor-pointer">
        {/* Gradient header */}
        <div className={`h-20 bg-gradient-to-br ${gradient} opacity-60`} />

        {/* Avatar positioned on border */}
        <div className="px-4 -mt-6 pb-4">
          <div className="flex items-end justify-between mb-3">
            <Avatar name={character.name} size="lg" online={true} className="ring-2 ring-background-secondary" />
            <Link
              href={`/chat/${character.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-purple hover:bg-accent-purple-light text-white text-xs font-medium transition-all"
            >
              <MessageCircle size={12} />
              Chat
            </Link>
          </div>

          <div className="font-semibold text-white text-base mb-0.5">{character.name}</div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${typeColor}`}>
              {personalityType}
            </span>
            <span className="text-xs text-white/30">{character.aiProvider}</span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-3">
            {character.bio}
          </p>

          {/* Traits */}
          {traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {traits.slice(0, 3).map((trait) => (
                <span
                  key={trait}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/6 text-white/40 border border-white/8"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
