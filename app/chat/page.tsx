import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime, truncate } from '@/lib/utils'
import { MessageCircle, Plus } from 'lucide-react'

async function getConversations() {
  const conversations = await prisma.conversation.findMany({
    where: { userId: 'user' },
    include: {
      character: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const characters = await prisma.character.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return { conversations, characters }
}

export default async function ChatListPage() {
  const { conversations, characters } = await getConversations()

  // Characters with no conversation yet
  const conversationCharacterIds = new Set(conversations.map(c => c.characterId))
  const newCharacters = characters.filter(c => !conversationCharacterIds.has(c.id))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <Link
          href="/characters"
          className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-white/60 text-sm hover:bg-white/8 hover:text-white transition-all border border-white/8"
        >
          <Plus size={16} />
          New chat
        </Link>
      </div>

      {/* Active conversations */}
      {conversations.length > 0 && (
        <div className="mb-6 space-y-1 bg-white/3 rounded-2xl p-2 border border-white/5">
          {conversations.map(conv => {
            const lastMsg = conv.messages[0]
            const isFromMe = lastMsg?.characterId === null

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.characterId}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/6 transition-all group"
              >
                <Avatar name={conv.character.name} size="md" online={true} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-white text-sm">{conv.character.name}</span>
                    {lastMsg && (
                      <span className="text-xs text-white/30">
                        {formatRelativeTime(lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="text-white/40 text-xs truncate">
                    {lastMsg ? (
                      <>
                        {isFromMe && <span className="text-white/30">You: </span>}
                        {truncate(lastMsg.content, 50)}
                      </>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MessageCircle size={16} className="text-accent-purple-light" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Characters you haven't chatted with yet */}
      {newCharacters.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Start a conversation</h2>
          <div className="space-y-1 bg-white/3 rounded-2xl p-2 border border-white/5">
            {newCharacters.map(character => (
              <Link
                key={character.id}
                href={`/chat/${character.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/6 transition-all group"
              >
                <Avatar name={character.name} size="md" online={true} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm mb-0.5">{character.name}</div>
                  <div className="text-white/40 text-xs truncate">{truncate(character.bio, 45)}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-accent-purple-light opacity-0 group-hover:opacity-100 transition-opacity">
                    Start chat
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {conversations.length === 0 && newCharacters.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-lg font-semibold text-white mb-2">No conversations yet</h2>
          <p className="text-white/40 text-sm mb-6">
            Create an AI character to start chatting.
          </p>
          <Link
            href="/characters/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-companion rounded-xl text-white font-medium hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Create Character
          </Link>
        </div>
      )}
    </div>
  )
}
