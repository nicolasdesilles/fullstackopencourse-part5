const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('blogs app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {

    const locator = await page.getByText('log in to the app')
    await expect(locator).toBeVisible()

  })
})