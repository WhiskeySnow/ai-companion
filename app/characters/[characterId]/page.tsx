import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { RelationshipWeb } from '@/components/characters/RelationshipWeb'
import { FeedPost } from '@/components/feed/FeedPost'
import { getPersonalityTraits, getAvatarGradient } from '@/lib/utils'
import { MessageCircle, ChevronLeft, Sparkles } from 'lucide-react'

async function getCharacterData(characterId: string) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      memories: { orderBy: { importance: 'desc' }, take: 10 },
      thoughts: { orderBy: { createdAt: 'desc' }, take: 3 },
      posts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          character: true,
          comments: { take: 3 },
        },
      },
      relationshipsA: {
        include: { characterB: true },
      },
      relationshipsB: {
        include: { characterA: true },
      },
    },
  })

  if (!character) return null

  const allCharacters = await prisma.character.findMany({
    select: { id: true, name: true },
  })

  const relationships = [
    ...character.relationshipsA.map(r => ({
      characterAId: r.characterAId,
      characterBId: r.characterBId,
      relationship: r.relationship,
      intimacy: r.intimacy,
      notes: r.notes,
    })),
    ...character.relationshipsB.map(r => ({
      characterAId: r.characterAId,
      characterBId: r.characterBId,
      relationship: r.relationship,
      intimacy: r.intimacy,
      notes: r.notes,
    })),
  ]

  return { character, relationships, allCharacters }
}

export default async function CharacterDetailPage({
  params,
}: {
  params: { characterId: string }
}) {
  const { characterId } = params
  const data = await getCharacterData(characterId)
  if (!data) notFound()

  const { character, relationships, allCharacters } = data
  const traits = getPersonalityTraits(character.personality)
  const gradient = getAvatarGradient(character.name)

  let personalityType = 'intellectual'
  let interests: string[] = []
  try {
    const p = JSON.parse(character.personality)
    personalityType = p.type || 'intellectual'
    interests = p.interests || []
  } catch {}

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="relative">
        <div className={`h-40 bg-gradient-to-br ${gradient} opacity-70`} />

        <div className="absolute top-4 left-4">
          <Link
            href="/characters"
            className="w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} className="text-white" />
          </Link>
        </div>

        <div className="px-6 -mt-8 pb-4">
          <div className="flex items-end justify-between mb-4">
            <Avatar
              name={character.name}
              size="xl"
              online={true}
              className="ring-4 ring-background"
            />
            <Link
              href={`/chat/${character.id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-companion rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent-purple/25"
            >
              <MessageCircle size={16} />
              Message
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">{character.name}</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-3">{character.bio}</p>

          <div className="flex flex-wrap gap-2 mb-1">
            <span className="text-xs px-3 py-1 rounded-full bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20 capitalize font-medium">
              {personalityType}
            </span>
            {traits.slice(0, 4).map(trait => (
              <span key={trait} className="text-xs px-2.5 py-1 rounded-full bg-white/6 text-white/50 border border-white/8">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Backstory */}
        <section className="bg-white/4 rounded-2xl border border-white/8 p-5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles size={14} />
            Backstory
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">{character.backstory}</p>
        </section>

        {/* Interests */}
        {interests.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span
                  key={interest}
                  className="text-sm px-3 py-1.5 rounded-xl bg-white/5 text-white/60 border border-white/8 hover:bg-white/8 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Relationships */}
        {relationships.length > 0 && (
          <section className="bg-white/4 rounded-2xl border border-white/8 p-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              Their Circle
            </h2>
            <RelationshipWeb
              characterId={character.id}
              relationships={relationships}
              characters={allCharacters}
            />
          </section>
        )}

        {/* Thoughts about you */}
        {character.thoughts.length > 0 && (
          <section className="bg-gradient-card rounded-2xl border border-white/8 p-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              {character.name} is thinking...
            </h2>
            <div className="space-y-3">
              {character.thoughts.map(thought => (
                <div key={thought.id} className="flex gap-3">
                  <div className="text-lg">
                    {thought.sentiment === 'positive' ? '💭' : thought.sentiment === 'curious' ? '🤔' : '💭'}
                  </div>
                  <p className="text-white/70 text-sm italic leading-relaxed">
                    "{thought.content}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts */}
        {character.posts.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              Recent Posts
            </h2>
            <div className="space-y-4">
              {character.posts.map(post => (
                <FeedPost
                  key={post.id}
                  post={{
                    ...post,
                    createdAt: post.createdAt.toISOString(),
                    character: {
                      ...post.character,
                      avatar: post.character.avatar ?? null,
                    },
                    comments: post.comments.map(c => ({
                      ...c,
                      createdAt: c.createdAt.toISOString(),
                    })),
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
