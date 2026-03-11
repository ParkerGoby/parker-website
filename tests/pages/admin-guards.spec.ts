import { test, expect } from '@playwright/test'
import { SEED_POST } from '../fixtures/known-posts'

test.describe('Admin route guards (unauthenticated)', () => {
  test('/blog/new redirects to /blog', async ({ page }) => {
    await page.goto('/blog/new')
    await expect(page).toHaveURL('/blog')
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
    await expect(page.locator('textarea')).not.toBeVisible()
  })

  test('/blog/[slug]/edit redirects to /blog/[slug]', async ({ page }) => {
    await page.goto(`/blog/${SEED_POST.slug}/edit`)
    await expect(page).toHaveURL(`/blog/${SEED_POST.slug}`)
    // Scope to article header to avoid matching the h1 in post body markdown
    const articleHeader = page.locator('article header')
    await expect(articleHeader.getByRole('heading', { level: 1 })).toHaveText(SEED_POST.title)
    await expect(page.locator('textarea')).not.toBeVisible()
  })
})
