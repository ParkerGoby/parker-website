# Parker's Portfolio

Personal portfolio and blog site built with Next.js. Showcases projects and serves as a technical blog for writing about software development.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Blog**: MDX with gray-matter and reading-time
- **Icons**: lucide-react
- **Package manager**: pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Production build         |
| `pnpm lint`    | Run ESLint               |
| `pnpm format`  | Run Prettier             |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── layout/       # Layout components (header, footer, etc.)
│   └── sections/     # Page section components
├── content/
│   └── blog/         # MDX blog posts
├── lib/
│   ├── blog.ts       # Blog utilities
│   └── projects.ts   # Project data
└── types/            # Shared TypeScript types
```

## Adding Content

**Blog posts** — add `.mdx` files to `src/content/blog/` with the following frontmatter:

```yaml
---
title: Post Title
date: 'YYYY-MM-DD'
excerpt: A short description of the post.
tags: [tag1, tag2]
published: true
---
```

**Projects** — add entries to the `projects` array in `src/lib/projects.ts`.
