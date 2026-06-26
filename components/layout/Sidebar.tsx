'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageCircle, Rss, User, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/characters', icon: Users, label: 'Characters' },
  { href: '/feed', icon: Rss, label: 'Feed' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-14 bottom-0 bg-background-secondary border-r border-white/5 p-4">
      <div className="flex-1 space-y-1">
        {navItems.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* New Character button */}
      <div className="mt-auto space-y-2">
        <Link
          href="/characters/new"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-companion text-white hover:opacity-90 transition-all"
        >
          <Sparkles size={18} />
          New Character
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={18} />
          Settings
        </Link>
      </div>
    </aside>
  )
}
