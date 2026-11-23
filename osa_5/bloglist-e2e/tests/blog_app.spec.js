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
  })

  describe('When logged in and created a blog', () => {
    beforeEach(async ({ page }) => {
      // login
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
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
})