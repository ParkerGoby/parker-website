import Hero from '@/components/sections/Hero'
import ProjectCard from '@/components/sections/ProjectCard'
import BlogCard from '@/components/sections/BlogCard'
import Contact from '@/components/sections/Contact'
import { projects } from '@/lib/projects'
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  const featuredProjects = projects.slice(0, 3)

  return (
    <>
      <Hero />

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
              <div className="mt-1 h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-teal-400" />
            </div>
            <Link
              href="/projects"
              className="text-sm text-neutral-500 transition-colors hover:text-cyan-400"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Writing</h2>
                <div className="mt-1 h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-teal-400" />
              </div>
              <Link
                href="/blog"
                className="text-sm text-neutral-500 transition-colors hover:text-cyan-400"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 flex flex-col divide-y divide-neutral-800">
              {posts.map((post) => (
                <div key={post.slug} className="py-4 first:pt-0 last:pb-0">
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact />
    </>
  )
}
