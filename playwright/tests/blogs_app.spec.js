const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('blogs app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'secure'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {

    const locator = await page.getByText('log in to the app')
    await expect(locator).toBeVisible()

  })

  describe('login', () => {

    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByTestId('login-username').fill('testuser')
      await page.getByTestId('login-password').fill('secure')
      
      await page.getByTestId('login-button').click()
  
      await expect(page.getByText('User Test User is logged in')).toBeVisible()
  
  
    })

    test('fails with wrong credentials', async ({ page }) => {

      await page.getByTestId('login-username').fill('testuser')
      await page.getByTestId('login-password').fill('invalid')
      
      await page.getByTestId('login-button').click()
  
      await expect(page.getByText('wrong username or password')).toBeVisible()
  
    })

  })

})