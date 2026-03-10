import { notFound, redirect } from 'next/navigation'
import { getCurrentRole } from '@/lib/auth-utils'
import { getPostBySlugAdmin } from '@/lib/db-blog'
import EditBlogForm from '@/components/sections/EditBlogForm'

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
  const tagsString = post.tags.join(', ')

  return (
    <EditBlogForm
      initialTitle={post.title}
      initialExcerpt={post.excerpt}
      initialTags={tagsString}
      initialContent={content}
      initialPublished={post.published}
      slug={slug}
    />
  )
}
