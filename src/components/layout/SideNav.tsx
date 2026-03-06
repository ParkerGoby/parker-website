'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, Menu, X, Home, FolderOpen, FileText, LogIn, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/blog', label: 'Blog', icon: FileText },
]

const socialLinks = [
  { href: 'https://github.com/ParkerGoby', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/parker-goby-b0336a25b/', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:parkergoby1@gmail.com', label: 'Email', icon: Mail },
]

export default function SideNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const NavContent = () => (
    <div className="flex h-full flex-col px-4 py-6">
      {/* Logo */}
      <div className="mb-8 px-2">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Parker G
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50'
                : 'text-neutral-400 hover:bg-cyan-950/50 hover:text-cyan-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Social Icons */}
      <div className="mt-6 flex items-center gap-3 px-3">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-cyan-400"
          >
            <Icon size={18} />
          </Link>
        ))}
      </div>

      {/* Auth UI */}
      <div className="mt-4 border-t border-neutral-800/60 px-3 pt-4">
        {status === 'authenticated' && session?.user ? (
          <div className="flex items-center gap-2">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'User avatar'}
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-900 text-xs text-cyan-400">
                {session.user.name?.[0] ?? '?'}
              </div>
            )}
            <span className="flex-1 truncate text-xs text-neutral-400">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              aria-label="Sign out"
              className="text-neutral-500 transition-colors hover:text-cyan-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-cyan-950/50 hover:text-cyan-300"
          >
            <LogIn size={16} />
            Sign in
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-neutral-800/60 bg-[#0a0f0f] md:block">
        <NavContent />
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-[#0a0f0f] text-neutral-400 transition-colors hover:text-cyan-400 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-800/60 bg-[#0a0f0f] transition-transform duration-200 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-200"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
        <NavContent />
      </aside>
    </>
  )
}
