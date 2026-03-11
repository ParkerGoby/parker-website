import { test, expect } from '@playwright/test'
import { SEED_POST } from '../fixtures/known-posts'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    expect(errors).toHaveLength(0)
  })

  test('hero h1 contains "Hi, I\'m Parker"', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: /hi, i'm parker/i })).toBeVisible()
  })

  test('hero bio text is present', async ({ page }) => {
    await expect(page.locator('main')).toContainText(/software engineer/i)
  })

  test('hero has 3 social links with correct security attributes', async ({ page }) => {
    const heroSection = page.locator('section').first()
    const socialLinks = heroSection.locator('a[href^="http"], a[href^="mailto"]')
    await expect(socialLinks).toHaveCount(3)
    const count = await socialLinks.count()
    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('Projects section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })

  test('Projects "View all" links to /projects', async ({ page }) => {
    const viewAll = page.locator('a[href="/projects"]').filter({ hasText: /view all/i })
    await expect(viewAll).toBeVisible()
  })

  test('Projects section has at least 1 project card', async ({ page }) => {
    await expect(page.getByText('Parker Portfolio')).toBeVisible()
  })

  test('Writing section has at least 1 blog card', async ({ page }) => {
    // Home page shows the 4 most recent posts; the seed post may be displaced
    // by newer posts, so we just verify that at least 1 blog card link is rendered.
    const blogCardLink = page.locator('a[href^="/blog/"]').first()
    await expect(blogCardLink).toBeVisible()
  })

  test('Writing "View all" links to /blog', async ({ page }) => {
    const viewAll = page.locator('a[href="/blog"]').filter({ hasText: /view all/i })
    await expect(viewAll).toBeVisible()
  })

  test('Contact section "Get in Touch" heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible()
  })

  test('Contact section has 3 links with correct security attributes', async ({ page }) => {
    // The contact section is the last <section> on the page
    const contactSection = page.locator('section').last()
    const contactLinks = contactSection.locator('a[href^="http"], a[href^="mailto"]')
    const count = await contactLinks.count()
    expect(count).toBeGreaterThanOrEqual(3)
    for (let i = 0; i < count; i++) {
      const link = contactLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('all external links have correct security attributes', async ({ page }) => {
    const externalLinks = page.locator('a[href^="http"], a[href^="mailto"]')
    const count = await externalLinks.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
