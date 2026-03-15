import { test, expect } from '@playwright/test'

test.describe('Desktop navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hamburger button is not visible on desktop', async ({ page }) => {
    await expect(page.getByLabel('Open menu')).not.toBeVisible()
  })

  test('nav links are visible and route correctly', async ({ page }) => {
    // Desktop sidebar is visible at md+ breakpoints
    const sidebar = page.locator('aside').first()

    const projectsLink = sidebar.getByRole('link', { name: 'Projects' })
    await expect(projectsLink).toBeVisible()
    await projectsLink.click()
    await expect(page).toHaveURL('/projects')

    await page.goto('/')
    const blogLink = sidebar.getByRole('link', { name: 'Blog' })
    await expect(blogLink).toBeVisible()
    await blogLink.click()
    await expect(page).toHaveURL('/blog')
  })

  test('social icons are present in sidebar', async ({ page }) => {
    const sidebar = page.locator('aside').first()
    // 3 social links (GitHub, LinkedIn, Email)
    const socialLinks = sidebar.locator('a[href^="http"], a[href^="mailto"]')
    await expect(socialLinks).toHaveCount(3)
  })

  test('Sign in button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })
})

test.describe('Theme toggle', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('toggle button is visible in the sidebar', async ({ page }) => {
    await page.goto('/')
    const sidebar = page.locator('aside').first()
    await expect(sidebar.getByLabel('Toggle theme')).toBeVisible()
  })

  test('clicking toggle adds/removes dark class on <html>', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    })

    const isDarkBefore = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )
    expect(isDarkBefore).toBe(false)

    await page.locator('aside').first().getByLabel('Toggle theme').click()

    const isDarkAfter = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )
    expect(isDarkAfter).toBe(true)
  })

  test('theme choice is persisted to localStorage', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    })

    const toggle = page.locator('aside').first().getByLabel('Toggle theme')

    await toggle.click()
    const stored = await page.evaluate(() => localStorage.getItem('theme'))
    expect(stored).toBe('dark')

    await toggle.click()
    const storedAgain = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedAgain).toBe('light')
  })

  test('localStorage preference is applied on next load', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('theme', 'dark'))
    await page.reload()

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )
    expect(isDark).toBe(true)
  })
})

test.describe('Mobile navigation (Pixel 5)', () => {
  test.use({ viewport: { width: 393, height: 851 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('desktop sidebar is hidden on mobile', async ({ page }) => {
    await expect(page.getByLabel('Open menu')).toBeVisible()
    // Desktop aside is display:none on mobile
    const desktopSidebar = page.locator('aside').first()
    await expect(desktopSidebar).not.toBeVisible()
  })

  test('hamburger opens the drawer', async ({ page }) => {
    await page.getByLabel('Open menu').click()
    // After opening, nav links should be in viewport
    const mobileDrawer = page.locator('aside').nth(1)
    await expect(mobileDrawer).toBeInViewport()
    await expect(mobileDrawer.getByRole('link', { name: 'Blog' })).toBeVisible()
  })

  test('X button closes the drawer', async ({ page }) => {
    await page.getByLabel('Open menu').click()
    await expect(page.locator('aside').nth(1)).toBeInViewport()
    await page.getByLabel('Close menu').click()
    await expect(page.locator('aside').nth(1)).not.toBeInViewport()
  })

  test('clicking the overlay closes the drawer', async ({ page }) => {
    await page.getByLabel('Open menu').click()
    await expect(page.locator('aside').nth(1)).toBeInViewport()
    // Click the overlay (the semi-transparent backdrop)
    await page.locator('.fixed.inset-0').click()
    await expect(page.locator('aside').nth(1)).not.toBeInViewport()
  })

  test('clicking a nav link closes drawer and navigates', async ({ page }) => {
    await page.getByLabel('Open menu').click()
    const mobileDrawer = page.locator('aside').nth(1)
    await mobileDrawer.getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL('/projects')
    // Drawer should be closed after navigation
    await expect(page.locator('aside').nth(1)).not.toBeInViewport()
  })
})
