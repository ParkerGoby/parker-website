import { db } from './index'
import { posts } from './schema'

const examplePost = {
  slug: 'hello-world',
  title: 'Hello World',
  date: '2026-03-06',
  excerpt: 'My first post — an introduction to this blog and what I plan to write about.',
  content: `# Hello World

Welcome to my blog! I'm Parker, and this is the first post on my personal site.

## What I'll Write About

I plan to cover a range of topics including:

- **Web development** — Next.js, TypeScript, and modern frontend patterns
- **Systems programming** — Rust, performance, and low-level topics
- **Projects** — deep dives into things I'm building

## Why a Blog?

Writing forces clarity. When you can't explain something simply, you probably don't understand it well enough yet. This blog is as much for me as it is for anyone who stumbles across it.

Stay tuned for more posts.
`,
  tags: ['meta', 'intro'],
  published: true,
  readingTime: '2 min read',
}

async function seed() {
  console.log('Seeding database...')
  await db.insert(posts).values(examplePost).onConflictDoNothing()
  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
