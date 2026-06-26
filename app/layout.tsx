import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SideNav } from '@/components/layout/SideNav'

export const metadata: Metadata = {
  title: 'If — AI Companion',
  description: 'Your personal AI social world.',
}

export const viewport: Viewport = {
  themeColor: '#EDEDED',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" style={{ colorScheme: 'light' }}>
      <body style={{ background: '#EDEDED', overflow: 'hidden', height: '100vh' }}>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <SideNav />
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
