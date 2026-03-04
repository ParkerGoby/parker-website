export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  published: boolean
  readingTime?: string
}

export interface Project {
  title: string
  description: string
  tech: string[]
  url?: string
  github?: string
}
