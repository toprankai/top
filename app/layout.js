import './globals.css'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'

export const metadata = {
  title: 'TopRank AI - Local SEO Intelligence Platform',
  description: 'Track local visibility, manage GBP workflows, and deliver clean performance insights with TopRank AI.',
  icons: {
    icon: '/favicon_logo.png',
    shortcut: '/favicon_logo.png',
    apple: '/favicon_logo.png',
  }
}

import { RootScripts } from '@/components/seoos/RootScripts'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon_logo.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
          <WhatsAppButton />
          <RootScripts />
        </Providers>
      </body>
    </html>
  )
}
