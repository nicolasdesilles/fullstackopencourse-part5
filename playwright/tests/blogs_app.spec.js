const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper.js')
const { before } = require('node:test')


describe('blogs app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'secure'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Another User',
        username: 'anotheruser',
        password: 'verysecure'
      }
    })

    await page.goto('/')
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

    test('a blog added by another user will not display the delete button', async ({ page }) => {

      await createBlog(page, 'Blog From Someone Else', 'An Author', 'https://hey.fr')
      await expect(page.getByText(`Blog From Someone Else by An Author`)).toBeVisible()

      await page.getByRole("button", { name: 'logout'}).click()

      await loginWith(page, 'anotheruser', 'verysecure')

      await page.getByRole("button", { name: 'view'}).first().click()

      const removeButton = await page.getByRole("button", { name: 'remove'}).first()
      await expect(removeButton).toBeHidden()
      
    })

    test('the blogs are ordered by decreasing number of likes', async ({ page }) => {

      await createBlog(page, 'Blog 1', 'Author1', 'https://blog1.fr')
      await createBlog(page, 'Blog 2', 'Author2', 'https://blog2.fr')
      await createBlog(page, 'Blog 3', 'Author3', 'https://blog3.fr')

      await page.getByRole("button", { name: 'view'}).first().click()
      await page.getByRole("button", { name: 'view'}).first().click()
      await page.getByRole("button", { name: 'view'}).first().click()

      const blog1Element = await page.getByText('Blog 1 by Author1')

      await blog1Element.getByRole("button", { name: 'like'}).click()
      await expect(blog1Element.getByText('likes:')).toHaveText('likes: 1')

      await blog1Element.getByRole("button", { name: 'like'}).click()
      await expect(blog1Element.getByText('likes:')).toHaveText('likes: 2')

      const blog3Element = await page.getByText('Blog 3 by Author3')

      await blog3Element.getByRole("button", { name: 'like'}).click()
      await expect(blog3Element.getByText('likes:')).toHaveText('likes: 1')

      const displayedBlogs = await page.getByText(/Blog . by Author./).all()

      await expect(displayedBlogs[0]).toContainText('Blog 1 by Author1')
      await expect(displayedBlogs[1]).toContainText('Blog 3 by Author3')
      await expect(displayedBlogs[2]).toContainText('Blog 2 by Author2')


      
      
    })    

  })

})