const loginWith = async (page, username, password) => {
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'login', exact: true }).click()
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog', exact: true }).click()
  await page.locator('#title').fill(title)
  await page.locator('#author').fill(author)
  await page.locator('#url').fill(url)
  await page.getByRole('button', { name: 'create', exact: true }).click()
}

module.exports = { loginWith, createBlog }
