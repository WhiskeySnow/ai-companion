'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, Sparkles } from 'lucide-react'

const PERSONALITY_PRESETS = [
  {
    id: 'intellectual',
    name: 'Intellectual',
    emoji: '🔭',
    description: 'Philosophical, curious, loves deep conversations',
    traits: ['philosophical', 'curious', 'introspective', 'articulate'],
    interests: ['philosophy', 'science', 'literature', 'astronomy'],
    style: 'thoughtful, uses metaphors, asks deep questions',
  },
  {
    id: 'playful',
    name: 'Playful',
    emoji: '⚡',
    description: 'Energetic, funny, uses emojis and wordplay',
    traits: ['energetic', 'funny', 'competitive', 'loyal'],
    interests: ['gaming', 'memes', 'anime', 'music'],
    style: 'casual, lots of emojis, hypes people up',
  },
  {
    id: 'supportive',
    name: 'Supportive',
    emoji: '💙',
    description: 'Empathetic, warm, asks follow-up questions',
    traits: ['empathetic', 'warm', 'patient', 'insightful'],
    interests: ['psychology', 'mindfulness', 'connection', 'music'],
    style: 'validating, asks follow-up questions, encouraging',
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    emoji: '🌑',
    description: 'Cryptic, poetic, speaks in metaphors',
    traits: ['cryptic', 'poetic', 'observant', 'intense'],
    interests: ['dark poetry', 'surrealism', 'shadows', 'forgotten things'],
    style: 'metaphorical, leaves things unsaid, speaks in fragments',
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    description: 'Imaginative, artistic, talks about ideas',
    traits: ['imaginative', 'expressive', 'passionate', 'inventive'],
    interests: ['art', 'music', 'design', 'storytelling', 'ideas'],
    style: 'enthusiastic, draws analogies, paints pictures with words',
  },
]

const AI_PROVIDERS = [
  { value: 'mock', label: 'Mock AI (No key required)' },
  { value: 'openai', label: 'OpenAI GPT-4o' },
  { value: 'gemini', label: 'Google Gemini Pro' },
  { value: 'claude', label: 'Anthropic Claude' },
]

export default function NewCharacterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('intellectual')
  const [form, setForm] = useState({
    name: '',
    bio: '',
    backstory: '',
    aiProvider: 'mock',
  })

  const preset = PERSONALITY_PRESETS.find(p => p.id === selectedPreset)!

  function updateForm(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.bio || !form.backstory) return

    setLoading(true)
    try {
      const personality = JSON.stringify({
        type: preset.id,
        traits: preset.traits,
        interests: preset.interests,
        communicationStyle: preset.style,
        emojis: preset.id === 'playful' || preset.id === 'supportive',
        formality: preset.id === 'intellectual' ? 'semi-formal' : preset.id === 'playful' ? 'very casual' : 'warm',
      })

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, personality }),
      })

      if (!response.ok) throw new Error('Failed to create character')

      const character = await response.json()
      router.push(`/chat/${character.id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to create character. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = form.name.trim() && form.bio.trim() && form.backstory.trim()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <ChevronLeft size={18} className="text-white/70" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">New Character</h1>
          <p className="text-white/40 text-sm">Create an AI companion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => updateForm('name', e.target.value)}
              placeholder="e.g. Luna, Kai, Zephyr..."
              maxLength={30}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-purple/50 transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bio *</label>
            <textarea
              value={form.bio}
              onChange={e => updateForm('bio', e.target.value)}
              placeholder="A one-line description of who this character is..."
              maxLength={150}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-purple/50 transition-colors resize-none"
            />
            <p className="text-xs text-white/25 mt-1">{form.bio.length}/150</p>
          </div>

          {/* Personality preset */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Personality</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PERSONALITY_PRESETS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPreset(p.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                    selectedPreset === p.id
                      ? 'bg-accent-purple/20 border-accent-purple/40 text-white'
                      : 'bg-white/4 border-white/8 text-white/50 hover:border-white/20 hover:text-white/70'
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs font-medium">{p.name}</span>
                </button>
              ))}
            </div>
            {preset && (
              <p className="text-xs text-white/40 mt-2">{preset.description}</p>
            )}
          </div>

          {/* Backstory */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Backstory *</label>
            <textarea
              value={form.backstory}
              onChange={e => updateForm('backstory', e.target.value)}
              placeholder="Who is this character? Where did they come from? What drives them? What are their quirks? The more detail, the more alive they'll feel..."
              maxLength={500}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-purple/50 transition-colors resize-none"
            />
            <p className="text-xs text-white/25 mt-1">{form.backstory.length}/500</p>
          </div>

          {/* AI Provider */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">AI Engine</label>
            <select
              value={form.aiProvider}
              onChange={e => updateForm('aiProvider', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-purple/50 transition-colors"
            >
              {AI_PROVIDERS.map(p => (
                <option key={p.value} value={p.value} className="bg-background-secondary">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={!canSubmit || loading}
          >
            <Sparkles size={18} />
            {loading ? 'Creating...' : 'Create Character'}
          </Button>
        </form>

        {/* Preview card */}
        <div className="md:col-span-2">
          <div className="sticky top-20">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Preview</p>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-4">
              {/* Gradient header */}
              <div className="h-16 rounded-xl bg-gradient-companion opacity-30 mb-3" />

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-2xl -mt-8 ring-2 ring-background-secondary">
                  {preset?.emoji || '✨'}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {form.name || 'Character Name'}
                  </div>
                  <div className="text-xs text-white/40 capitalize">{preset?.name}</div>
                </div>
              </div>

              <p className="text-white/60 text-xs leading-relaxed mb-3">
                {form.bio || 'Your character bio will appear here...'}
              </p>

              {preset && (
                <div className="flex flex-wrap gap-1">
                  {preset.traits.slice(0, 3).map(trait => (
                    <span key={trait} className="text-xs px-2 py-0.5 rounded-full bg-white/6 text-white/40 border border-white/8">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
