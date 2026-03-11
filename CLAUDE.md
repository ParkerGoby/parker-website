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
- After completing a feature, assess whether it is significant enough to warrant a README update (e.g., new section, major new functionality, changed setup steps). If so, update the README accordingly.
- **Never run `git commit`. Always leave committing to the user.**

## Conventions
- Use `@/*` import alias (maps to `src/`)
- Components: PascalCase, co-located with their types
- Blog frontmatter required fields: title, date, excerpt, published (boolean)
- Run `pnpm build` after changes to catch TypeScript and build errors
- External links (href starting with `http://`, `https://`, or `mailto:`) must always include `target="_blank"` and `rel="noopener noreferrer"`. Internal links (href starting with `/`) do not get these attributes.

## Content
- Add blog posts as `.mdx` files in `src/content/blog/`
- Update project list in `src/lib/projects.ts`

## Testing
- `pnpm test` — run full Playwright E2E suite (requires production build + DB running)
- `pnpm test:ui` — open Playwright UI mode
- `pnpm test:headed` — run tests in headed browser
- `pnpm test:report` — view last HTML report

### Local workflow
1. Ensure PostgreSQL is running
2. `pnpm db:seed` — seed the database (idempotent, safe to run multiple times)
3. `pnpm build && pnpm test`

### Rules
- Add a spec in `tests/pages/` for every new page/route
- Add a redirect assertion to `tests/pages/admin-guards.spec.ts` for every new admin-only route
- The page-level external link sweep in each spec automatically catches any missing `target="_blank"` / `rel="noopener noreferrer"` attributes

### Important
- **Do not delete or unpublish the `hello-world` seed post** without also updating `tests/fixtures/known-posts.ts`. Many specs depend on this post existing and being published.
