const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
        data: {
        name: 'Second User',
        username: 'seconduser',
        password: 'secret'
    }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Welcome Matti Luukkainen')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('peruna')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title').fill('Test blog1')
      await page.getByLabel('author').fill('Test Author')
      await page.getByLabel('url').fill('https://cats.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test blog1', { exact: false })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title').fill('Test blog')
      await page.getByLabel('author').fill('Test Author')
      await page.getByLabel('url').fill('https://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    describe('When logged in and created a blog', () => {
      beforeEach(async ({ page }) => {
      //make blog
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title').fill('Test blog1')
        await page.getByLabel('author').fill('Test Author')
        await page.getByLabel('url').fill('https://cats.com')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a blog can be deleted by creator', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByText('Test blog1', { exact: false })).not.toBeVisible()
      })
      test('a blog cannot be deleted by non creator', async({page})=>{
        //logout and login with newuser
        await page.getByRole('button', {name: 'logout'}).click()
        await page.getByLabel('username').fill('seconduser')
        await page.getByLabel('password').fill('secret')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Test blog1')).toBeVisible()
        await expect(page.getByRole('button', {name:'delete'}, { exact: true })).not.toBeVisible()
      })
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
  // create first blog
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill('First blog')
  await page.getByLabel('author').fill('First Author')
  await page.getByLabel('url').fill('https://first.com')
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText('First blog', { exact: false }).waitFor()
  // create second blog
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill('Second blog')
  await page.getByLabel('author').fill('Second Author')
  await page.getByLabel('url').fill('https://second.com')
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText('Second blog', { exact: false }).waitFor()
  // create third blog
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill('Third blog')
  await page.getByLabel('author').fill('Third Author')
  await page.getByLabel('url').fill('https://third.com')
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText('Third blog', { exact: false }).waitFor()

  // give Second blog 1 like
  const secondBlog = page.locator('.blog').filter({ hasText: 'Second blog' })
  await secondBlog.getByRole('button', { name: 'view' }).click()
  await secondBlog.getByRole('button', { name: 'like' }).click()
  await expect(secondBlog).toContainText('likes 1')
  // give Third blog 2 likes
  const thirdBlog = page.locator('.blog').filter({ hasText: 'Third blog' })
  await thirdBlog.getByRole('button', { name: 'view' }).click()
  await thirdBlog.getByRole('button', { name: 'like' }).click()
  await expect(thirdBlog).toContainText('likes 1')
  await thirdBlog.getByRole('button', { name: 'like' }).click()
  await expect(thirdBlog).toContainText('likes 2')

  const blogs = page.locator('.blog')

  await expect(blogs.first()).toContainText('Third blog')
  await expect(blogs.nth(1)).toContainText('Second blog')
  await expect(blogs.nth(2)).toContainText('First blog')
    })
  })
})