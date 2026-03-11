import { notFound, redirect } from 'next/navigation'
import { getCurrentRole } from '@/lib/auth-utils'
import { getPostBySlugAdmin } from '@/lib/db-blog'
import BlogForm from '@/components/sections/BlogForm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditBlogPage({ params }: Props) {
  const { slug } = await params

  const role = await getCurrentRole()
  if (role !== 'admin') {
    redirect(`/blog/${slug}`)
  }

  const result = await getPostBySlugAdmin(slug)
  if (!result) notFound()

  const { post, content } = result

  return (
    <BlogForm
      mode="edit"
      slug={slug}
      initialTitle={post.title}
      initialExcerpt={post.excerpt}
      initialTags={post.tags.join(', ')}
      initialContent={content}
      initialPublished={post.published}
    />
  )
}
