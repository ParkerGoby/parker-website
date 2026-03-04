# Parker Portfolio

## Commands
- `pnpm dev` — start dev server (localhost:3000)
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm format` — Prettier

## Architecture
- Next.js App Router, TypeScript, Tailwind CSS v4
- Blog posts: MDX files in `src/content/blog/` with frontmatter (title, date, excerpt, tags)
- Projects: static data in `src/lib/projects.ts`
- All components in `src/components/`, organized by `layout/` and `sections/`

## Git Workflow
- **Always create a `feature/<name>` branch before making any code changes. Never commit directly to `main`.**
- Merge feature branches into `main` when work is complete

## Conventions
- Use `@/*` import alias (maps to `src/`)
- Components: PascalCase, co-located with their types
- Blog frontmatter required fields: title, date, excerpt, published (boolean)
- Run `pnpm build` after changes to catch TypeScript and build errors
- External links (href starting with `http://`, `https://`, or `mailto:`) must always include `target="_blank"` and `rel="noopener noreferrer"`. Internal links (href starting with `/`) do not get these attributes.

## Content
- Add blog posts as `.mdx` files in `src/content/blog/`
- Update project list in `src/lib/projects.ts`
