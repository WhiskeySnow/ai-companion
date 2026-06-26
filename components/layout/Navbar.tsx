'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageCircle, Rss, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/characters', icon: Users, label: 'Characters' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/feed', icon: Rss, label: 'Feed' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* Top bar — desktop */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-white/5 items-center px-6 gap-6">
        <Link href="/" className="font-bold text-lg text-white tracking-tight">
          <span className="bg-gradient-companion bg-clip-text text-transparent">If</span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          {navItems.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-accent-purple/15 text-accent-purple-light'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Bottom bar — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary/95 backdrop-blur-md border-t border-white/8 flex">
        {navItems.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all',
                active ? 'text-accent-purple-light' : 'text-white/35 hover:text-white/60'
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
