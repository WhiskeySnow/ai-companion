import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CharacterCard } from '@/components/characters/CharacterCard'
import { Plus, Search } from 'lucide-react'

async function getCharacters() {
  return prisma.character.findMany({
    orderBy: { createdAt: 'asc' },
  })
}

export default async function CharactersPage() {
  const characters = await getCharacters()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Characters</h1>
          <p className="text-white/40 text-sm mt-0.5">{characters.length} companions in your world</p>
        </div>
        <Link
          href="/characters/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-companion rounded-xl text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-accent-purple/20"
        >
          <Plus size={16} />
          New
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          placeholder="Search characters..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-purple/40 transition-colors"
        />
      </div>

      {/* Personality filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {['All', 'Intellectual', 'Playful', 'Supportive', 'Mysterious', 'Creative'].map(filter => (
          <button
            key={filter}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === 'All'
                ? 'bg-accent-purple/20 text-accent-purple-light border-accent-purple/30'
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/70'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Character grid */}
      {characters.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-lg font-semibold text-white mb-2">No companions yet</h2>
          <p className="text-white/40 text-sm mb-6">Create your first AI companion to get started.</p>
          <Link
            href="/characters/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-companion rounded-xl text-white font-medium hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Create Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}

          {/* Create new card */}
          <Link href="/characters/new" className="block">
            <div className="h-full min-h-[200px] rounded-2xl border-2 border-dashed border-white/10 hover:border-accent-purple/30 flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-accent-purple/15 flex items-center justify-center transition-all">
                <Plus size={24} className="text-white/30 group-hover:text-accent-purple-light transition-colors" />
              </div>
              <div className="text-center">
                <div className="text-white/50 group-hover:text-white/70 font-medium text-sm transition-colors">Create Character</div>
                <div className="text-white/25 text-xs">Add a new companion</div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
