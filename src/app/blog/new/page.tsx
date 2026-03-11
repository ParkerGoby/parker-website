import { redirect } from 'next/navigation'
import { getCurrentRole } from '@/lib/auth-utils'
import BlogForm from '@/components/sections/BlogForm'

export default async function NewBlogPage() {
  const role = await getCurrentRole()
  if (role !== 'admin') {
    redirect('/blog')
  }

  return <BlogForm mode="create" />
}
