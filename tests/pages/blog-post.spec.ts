import { test, expect } from '@playwright/test'
import { SEED_POST } from '../fixtures/known-posts'

test.describe('Blog post page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${SEED_POST.slug}`)
  })

  test('renders post title as h1', async ({ page }) => {
    // Scope to the article header to avoid matching the h1 in the post body markdown
    const articleHeader = page.locator('article header')
    await expect(articleHeader.getByRole('heading', { level: 1 })).toHaveText(SEED_POST.title)
  })

  test('date contains year', async ({ page }) => {
    await expect(page.getByText(SEED_POST.dateYear)).toBeVisible()
  })

  test('reading time is visible', async ({ page }) => {
    await expect(page.getByText(SEED_POST.readingTime)).toBeVisible()
  })

  test('tags are rendered', async ({ page }) => {
    for (const tag of SEED_POST.tags) {
      await expect(page.getByText(tag)).toBeVisible()
    }
  })

  test('post body content is rendered', async ({ page }) => {
    const article = page.locator('article')
    await expect(article).not.toBeEmpty()
    // Verify known content from the seed post body
    await expect(article).toContainText('Welcome to my blog')
  })

  test('no Edit button visible when unauthenticated', async ({ page }) => {
    await expect(page.getByRole('link', { name: /edit blog/i })).not.toBeVisible()
  })
})

test('unknown slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/does-not-exist')
  expect(response?.status()).toBe(404)
})
