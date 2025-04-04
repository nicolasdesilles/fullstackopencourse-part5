const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper.js')


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

      await loginWith(page, 'testuser', 'secure')
  
      await expect(page.getByText('User Test User is logged in')).toBeVisible()
  
  
    })

    test('fails with wrong credentials', async ({ page }) => {

      await loginWith(page, 'testuser', 'invalid')
  
      await expect(page.getByText('wrong username or password')).toBeVisible()
  
    })

  })

  describe('when logged in', () => {

    beforeEach(async ({ page }) => {

      await loginWith(page, 'testuser', 'secure')

    })

    test('a new blog can be created', async ({ page }) => {

      await createBlog(page, 'A Test Blog', 'Great Author', 'https://hello.fr')

      await expect(page.getByText(`successfully added blog 'A Test Blog' by 'Great Author'`)).toBeVisible()
      await expect(page.getByText(`A Test Blog by Great Author`)).toBeVisible()

    })

    test('a blog can be liked', async ({ page }) => {

      await createBlog(page, 'Likes Test Blog', 'Good Author', 'https://like.fr')

      await page.getByRole("button", { name: 'view'}).first().click()

      const likeButton = await page.getByRole("button", { name: 'like'}).first()
      await expect(likeButton).toBeVisible()
      await expect(page.getByText('likes:').first()).toHaveText('likes: 0')

      await likeButton.click()

      await expect(page.getByText('likes:').first()).toHaveText('likes: 1')

    })

    test('a blog added by the logged in user can be deleted', async ({ page }) => {

      await createBlog(page, 'Blog To Delete', 'Bad Author', 'https://bye.fr')

      await page.getByRole("button", { name: 'view'}).first().click()

      const removeButton = await page.getByRole("button", { name: 'remove'}).first()
      await expect(removeButton).toBeVisible()

      page.on('dialog', dialog => dialog.accept());

      await removeButton.click()

      await page.goto("http://localhost:5173")

      await expect(page.getByText('Blog To Delete by Bad Author')).not.toBeVisible()
      
    })

  })

})