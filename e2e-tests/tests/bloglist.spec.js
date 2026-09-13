const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const BACKEND = 'http://localhost:3001'

const TEST_USER = {
  name: 'Daniel Arenas Sedano',
  username: 'daniel',
  password: 'fullstack5'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${BACKEND}/api/testing/reset`)
    await request.post(`${BACKEND}/api/users`, { data: TEST_USER })
    await page.goto('/')
  })

  test('5.24 the blog list is shown at the root URL', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login', exact: true })).toBeVisible()
  })

  test('5.24 the login form is shown at /login', async ({ page }) => {
    await page.getByRole('link', { name: 'login', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  describe('5.28 Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, TEST_USER.username, TEST_USER.password)
      await expect(page.getByText('Daniel Arenas Sedano logged in')).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog', exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, TEST_USER.username, 'wrong-password')
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText('Daniel Arenas Sedano logged in')).not.toBeVisible()
    })
  })

  describe('5.28 When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, TEST_USER.username, TEST_USER.password)
    })

    test('a logged in user can create a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E blog',
        author: 'Samantha',
        url: 'https://example.com/e2e-blog'
      })

      await expect(page.getByText('a new blog Samantha E2E blog by Samantha added')).toBeVisible()
      await expect(page.locator('.blog', { hasText: 'Samantha E2E blog' })).toBeVisible()
    })

    test('a logged in user can like a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E likeable',
        author: 'Samantha',
        url: 'https://example.com/e2e-likeable'
      })

      const blog = page.locator('.blog', { hasText: 'Samantha E2E likeable' })
      await blog.getByRole('link', { name: 'view', exact: true }).click()

      await expect(page.getByText('https://example.com/e2e-likeable')).toBeVisible()
      await page.getByRole('button', { name: 'like', exact: true }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a logged in user can delete a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E deletable',
        author: 'Samantha',
        url: 'https://example.com/e2e-deletable'
      })

      const blog = page.locator('.blog', { hasText: 'Samantha E2E deletable' })
      await blog.getByRole('link', { name: 'view', exact: true }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove', exact: true }).click()

      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
      await expect(page.locator('.blog', { hasText: 'Samantha E2E deletable' })).not.toBeVisible()
    })
  })

  test('5.22 only the creator sees the delete button', async ({ page, request }) => {
    await loginWith(page, TEST_USER.username, TEST_USER.password)
    await createBlog(page, {
      title: 'Blog owned by daniel',
      author: 'Daniel',
      url: 'https://example.com/owned-by-daniel'
    })
    await expect(page.locator('.blog', { hasText: 'Blog owned by daniel' })).toBeVisible()

    await page.getByRole('button', { name: 'logout', exact: true }).click()
    await expect(page.getByRole('link', { name: 'login', exact: true })).toBeVisible()

    await request.post(`${BACKEND}/api/users`, {
      data: { name: 'Other User', username: 'other', password: 'otherpass' }
    })
    await loginWith(page, 'other', 'otherpass')
    await expect(page.getByText('Other User logged in')).toBeVisible()

    const blog = page.locator('.blog', { hasText: 'Blog owned by daniel' })
    await blog.getByRole('link', { name: 'view', exact: true }).click()

    await expect(page.getByRole('button', { name: 'like', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'remove', exact: true })).not.toBeVisible()
  })
})
