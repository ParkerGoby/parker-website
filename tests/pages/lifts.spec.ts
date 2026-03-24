import { test, expect } from '@playwright/test'

test.describe('Lifts page (unauthenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lifts')
  })

  test('renders Lifts heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Lifts' })).toBeVisible()
  })

  test('no write controls visible to unauthenticated users', async ({ page }) => {
    await expect(page.locator('text=Log Workout')).not.toBeVisible()
    await expect(page.locator('text=Save Workout')).not.toBeVisible()
    await expect(page.locator('text=Add Exercise')).not.toBeVisible()
  })

  test('no data view switcher for unauthenticated users', async ({ page }) => {
    await expect(page.getByText('My Progress')).not.toBeVisible()
  })

  test('no bodyweight log form for unauthenticated users', async ({ page }) => {
    await expect(page.getByText("Today's bodyweight")).not.toBeVisible()
  })

  test('all external links have correct security attributes', async ({ page }) => {
    const links = page.locator('a[href^="http"], a[href^="mailto"]')
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})

test.describe('Lifts history page (unauthenticated)', () => {
  test('renders Workout History heading', async ({ page }) => {
    await page.goto('/lifts/history')
    await expect(page.getByRole('heading', { name: 'Workout History' })).toBeVisible()
  })

  test('all external links have correct security attributes', async ({ page }) => {
    await page.goto('/lifts/history')
    const links = page.locator('a[href^="http"], a[href^="mailto"]')
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})

test.describe('Lifts API guards (unauthenticated)', () => {
  test('POST /api/lifts/workouts returns 401', async ({ request }) => {
    const res = await request.post('/api/lifts/workouts', {
      data: { date: '2026-03-23', exercises: [{ exerciseId: 1, sets: [] }] },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/lifts/bodyweight returns 401', async ({ request }) => {
    const res = await request.post('/api/lifts/bodyweight', {
      data: { date: '2026-03-23', weight: 185 },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/lifts/exercises returns 401', async ({ request }) => {
    const res = await request.post('/api/lifts/exercises', {
      data: { name: 'Test', muscleGroup: 'chest' },
    })
    expect(res.status()).toBe(401)
  })

  test('GET /api/lifts/workouts returns admin data by default', async ({ request }) => {
    const res = await request.get('/api/lifts/workouts')
    // Either 200 (admin data returned) or 200 with empty array if no admin exists
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })
})
