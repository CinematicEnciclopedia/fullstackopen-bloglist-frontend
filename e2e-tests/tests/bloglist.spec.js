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

  test('5.17 the login form is shown by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Blogs' })).not.toBeVisible()
  })

  describe('5.18 Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, TEST_USER.username, TEST_USER.password)
      await expect(page.getByText('Daniel Arenas Sedano logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, TEST_USER.username, 'wrong-password')
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText('Daniel Arenas Sedano logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, TEST_USER.username, TEST_USER.password)
    })

    test('5.19 a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E blog',
        author: 'Samantha',
        url: 'https://example.com/e2e-blog'
      })

      await expect(page.getByText('a new blog Samantha E2E blog by Samantha added')).toBeVisible()
      await expect(page.locator('.blog', { hasText: 'Samantha E2E blog' })).toBeVisible()
    })

    test('5.20 a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E likeable',
        author: 'Samantha',
        url: 'https://example.com/e2e-likeable'
      })

      const blog = page.locator('.blog', { hasText: 'Samantha E2E likeable' })
      await blog.getByRole('button', { name: 'view', exact: true }).click()
      await blog.getByRole('button', { name: 'like', exact: true }).click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('5.21 the creator can delete a blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Samantha E2E deletable',
        author: 'Samantha',
        url: 'https://example.com/e2e-deletable'
      })

      const blog = page.locator('.blog', { hasText: 'Samantha E2E deletable' })
      await blog.getByRole('button', { name: 'view', exact: true }).click()

      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove', exact: true }).click()

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
    await page.getByRole('button', { name: 'logout', exact: true }).click()

    await request.post(`${BACKEND}/api/users`, {
      data: { name: 'Other User', username: 'other', password: 'otherpass' }
    })
    await loginWith(page, 'other', 'otherpass')

    const blog = page.locator('.blog', { hasText: 'Blog owned by daniel' })
    await blog.getByRole('button', { name: 'view', exact: true }).click()

    await expect(blog.getByRole('button', { name: 'remove', exact: true })).not.toBeVisible()
    await expect(blog.getByRole('button', { name: 'like', exact: true })).toBeVisible()
  })

  test('5.23 blogs are ordered by likes', async ({ page }) => {
    await loginWith(page, TEST_USER.username, TEST_USER.password)

    await createBlog(page, {
      title: 'Blog with zero likes',
      author: 'Samantha',
      url: 'https://example.com/zero-likes'
    })
    await createBlog(page, {
      title: 'Blog with one like',
      author: 'Samantha',
      url: 'https://example.com/one-like'
    })

    const likedBlog = page.locator('.blog', { hasText: 'Blog with one like' })
    await likedBlog.getByRole('button', { name: 'view', exact: true }).click()
    await likedBlog.getByRole('button', { name: 'like', exact: true }).click()
    await expect(likedBlog.getByText('likes 1')).toBeVisible()

    const blogs = await page.locator('.blog').allTextContents()
    const zeroIndex = blogs.findIndex(text => text.includes('Blog with zero likes'))
    const oneIndex = blogs.findIndex(text => text.includes('Blog with one like'))

    expect(oneIndex).toBeGreaterThanOrEqual(0)
    expect(zeroIndex).toBeGreaterThanOrEqual(0)
    expect(oneIndex).toBeLessThan(zeroIndex)
  })
})
