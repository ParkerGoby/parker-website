import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import SideNav from '@/components/layout/SideNav'
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper'
import { auth } from '@/auth'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Parker G — Software Engineer',
    template: '%s | Parker G',
  },
  description: 'Software engineer building things on the web.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&p)){document.documentElement.classList.add('dark')}})()` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper session={session}>
          <div className="flex min-h-screen">
            <SideNav />
            <main className="flex-1 md:ml-64">{children}</main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
