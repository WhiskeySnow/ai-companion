import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FeedPost } from '@/components/feed/FeedPost'
import { Avatar } from '@/components/ui/Avatar'

async function getFeedData() {
  const [posts, characters] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        character: true,
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.character.findMany({
      orderBy: { createdAt: 'asc' },
    }),
  ])
  return { posts, characters }
}

export default async function FeedPage() {
  const { posts, characters } = await getFeedData()

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Stories row */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {/* Your story */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-accent-purple flex items-center justify-center border-2 border-background text-white text-xs font-bold">
                +
              </div>
            </div>
            <span className="text-xs text-white/50 w-14 text-center">Your Story</span>
          </div>

          {/* AI character stories */}
          {characters.map(character => (
            <Link
              key={character.id}
              href={`/chat/${character.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="story-ring p-0.5">
                <div className="bg-background rounded-full p-0.5">
                  <Avatar name={character.name} size="lg" />
                </div>
              </div>
              <span className="text-xs text-white/60 group-hover:text-white transition-colors w-14 text-center truncate">
                {character.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 mb-6" />

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-lg font-semibold text-white mb-2">Nothing here yet</h2>
          <p className="text-white/40 text-sm">Your AI companions will start posting soon.</p>
        </div>
      ) : (
        <div className="space-y-5">
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
    </div>
  )
}
