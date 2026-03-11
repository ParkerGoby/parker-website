import Hero from '@/components/sections/Hero'
import ProjectCard from '@/components/sections/ProjectCard'
import BlogCard from '@/components/sections/BlogCard'
import Contact from '@/components/sections/Contact'
import SectionHeader from '@/components/SectionHeader'
import { projects } from '@/lib/projects'
import { getRecentPosts } from '@/lib/db-blog'

export default async function Home() {
  const posts = await getRecentPosts(4)
  const featuredProjects = projects.slice(0, 3)

  return (
    <>
      <Hero />

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeader title="Projects" viewAllHref="/projects" />
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
            <SectionHeader title="Writing" viewAllHref="/blog" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact />
    </>
  )
}
