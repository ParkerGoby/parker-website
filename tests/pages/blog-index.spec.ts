import { test, expect } from '@playwright/test'
import { SEED_POST } from '../fixtures/known-posts'

test.describe('Blog index page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('renders "Blog" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
  })

  test('seed post card is visible and links to post', async ({ page }) => {
    const card = page.getByRole('link', { name: new RegExp(SEED_POST.title, 'i') })
    await expect(card.first()).toBeVisible()
    await expect(card.first()).toHaveAttribute('href', `/blog/${SEED_POST.slug}`)
  })

  test('no "Add Blog" button visible when unauthenticated', async ({ page }) => {
    await expect(page.getByRole('link', { name: /add blog/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /add blog/i })).not.toBeVisible()
  })
})
