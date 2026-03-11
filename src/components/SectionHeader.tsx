import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
}

export default function SectionHeader({ title, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="mt-1 h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-teal-400" />
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm text-neutral-500 transition-colors hover:text-cyan-400">
          View all →
        </Link>
      )}
    </div>
  )
}
