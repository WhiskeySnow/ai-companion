import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'If — AI Companion',
  description: 'Your personal AI social world. Chat, connect, and explore with AI companions that have their own lives, memories, and relationships.',
  themeColor: '#0d0d14',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Background gradient */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-pink/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent-cyan/4 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Navbar />

          {/* Layout wrapper */}
          <div className="flex">
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 md:pt-14 lg:pl-64 pb-20 md:pb-0 min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
