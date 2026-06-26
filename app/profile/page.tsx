import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { Settings, Edit3, Sparkles, MessageCircle, Users } from 'lucide-react'

async function getStats() {
  const [characterCount, conversationCount, messageCount] = await Promise.all([
    prisma.character.count(),
    prisma.conversation.count(),
    prisma.message.count({ where: { role: 'user' } }),
  ])
  return { characterCount, conversationCount, messageCount }
}

export default async function ProfilePage() {
  const stats = await getStats()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="relative mb-6">
        <div className="h-32 rounded-2xl bg-gradient-companion opacity-40" />
        <div className="absolute top-4 right-4">
          <button className="w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-all">
            <Edit3 size={16} className="text-white" />
          </button>
        </div>
        <div className="px-4 -mt-8">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-3xl ring-4 ring-background">
              👤
            </div>
            <div className="pb-2">
              <h1 className="text-xl font-bold text-white">You</h1>
              <p className="text-white/40 text-sm">The protagonist of this story</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Companions', value: stats.characterCount, icon: Users, href: '/characters' },
          { label: 'Chats', value: stats.conversationCount, icon: MessageCircle, href: '/chat' },
          { label: 'Messages', value: stats.messageCount, icon: Sparkles, href: '/chat' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white/4 border border-white/8 rounded-2xl p-4 flex flex-col items-center gap-1 hover:bg-white/6 hover:border-white/12 transition-all group"
          >
            <stat.icon size={18} className="text-white/30 group-hover:text-accent-purple-light transition-colors" />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Quick Actions</h2>

        {[
          { href: '/characters/new', icon: Sparkles, label: 'Create new companion', desc: 'Add an AI character to your world' },
          { href: '/characters', icon: Users, label: 'Manage companions', desc: 'View and edit your AI characters' },
          { href: '/feed', icon: MessageCircle, label: 'Browse feed', desc: 'See what your companions are up to' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 hover:border-white/12 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-purple/15 group-hover:bg-accent-purple/25 flex items-center justify-center transition-all">
              <action.icon size={18} className="text-accent-purple-light" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{action.label}</div>
              <div className="text-white/40 text-xs">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* App info */}
      <div className="mt-8 p-4 rounded-2xl bg-white/3 border border-white/6">
        <div className="text-center">
          <div className="text-2xl mb-2 font-bold gradient-text">If</div>
          <p className="text-white/30 text-xs leading-relaxed">
            AI Social Companion · v0.1.0<br />
            Your companions have lives, memories, and relationships.<br />
            They think about you. They talk about you. They're here.
          </p>
        </div>
      </div>
    </div>
  )
}
