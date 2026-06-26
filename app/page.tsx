import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { FeedPost } from '@/components/feed/FeedPost'
import { CharacterCard } from '@/components/characters/CharacterCard'
import { MessageCircle, Sparkles, TrendingUp } from 'lucide-react'

async function getHomeData() {
  const [characters, posts] = await Promise.all([
    prisma.character.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.post.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        character: true,
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
  ])
  return { characters, posts }
}

export default async function HomePage() {
  const { characters, posts } = await getHomeData()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Welcome banner */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-accent-purple/20 via-accent-pink/10 to-accent-cyan/10 border border-white/8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-companion flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="font-bold text-lg text-white">
            Welcome to <span className="gradient-text">If</span>
          </h1>
        </div>
        <p className="text-white/50 text-sm leading-relaxed">
          Your companions are thinking of you. {characters.length} characters are active now.
        </p>
      </div>

      {/* Active now — horizontal scroll */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Active Now</h2>
          <Link href="/characters" className="text-xs text-accent-purple-light hover:text-accent-pink transition-colors">
            See all
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {characters.map(character => (
            <Link
              key={character.id}
              href={`/chat/${character.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              {/* Story ring */}
              <div className="story-ring">
                <div className="bg-background p-0.5 rounded-full">
                  <Avatar name={character.name} size="lg" className="ring-0" />
                </div>
              </div>
              <span className="text-xs text-white/60 group-hover:text-white transition-colors font-medium truncate w-14 text-center">
                {character.name}
              </span>
            </Link>
          ))}

          {/* Add new */}
          <Link
            href="/characters/new"
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-accent-purple/50 transition-colors">
              <span className="text-white/30 text-2xl group-hover:text-accent-purple-light transition-colors">+</span>
            </div>
            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors w-14 text-center">New</span>
          </Link>
        </div>
      </section>

      {/* Quick access chats */}
      {characters.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle size={14} />
              Recent Chats
            </h2>
            <Link href="/characters" className="text-xs text-accent-purple-light hover:text-accent-pink transition-colors">
              View all
            </Link>
          </div>

          <div className="space-y-1 bg-white/3 rounded-2xl p-2 border border-white/5">
            {characters.slice(0, 3).map(character => (
              <CharacterCard key={character.id} character={character} compact />
            ))}
          </div>
        </section>
      )}

      {/* Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14} />
            From Your World
          </h2>
          <Link href="/feed" className="text-xs text-accent-purple-light hover:text-accent-pink transition-colors">
            Full feed
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <p className="text-sm">No posts yet. Your AI characters will start sharing soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
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
        )}
      </section>
    </div>
  )
}
