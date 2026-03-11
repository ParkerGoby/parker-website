import { test, expect } from '@playwright/test'

const PROJECT_TITLE = 'Parker Portfolio'
const PROJECT_TECH = ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX']
const PROJECT_GITHUB = 'https://github.com/ParkerGoby/parker-website'

test.describe('Projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('renders "Projects" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })

  test('Parker Portfolio card is visible', async ({ page }) => {
    await expect(page.getByText(PROJECT_TITLE)).toBeVisible()
  })

  test('project tech tags are rendered', async ({ page }) => {
    for (const tech of PROJECT_TECH) {
      await expect(page.getByText(tech).first()).toBeVisible()
    }
  })

  test('GitHub link has correct href and security attributes', async ({ page }) => {
    // Scope to main content to avoid picking up the sidebar social icon
    const mainContent = page.locator('main')
    const githubLink = mainContent.locator(`a[href="${PROJECT_GITHUB}"]`)
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('all external links have correct security attributes', async ({ page }) => {
    const externalLinks = page.locator('a[href^="http"], a[href^="mailto"]')
    const count = await externalLinks.count()
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
