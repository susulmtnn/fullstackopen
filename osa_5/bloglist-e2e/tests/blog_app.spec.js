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

    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong credentials')).toBeVisible()
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('link', { name: 'create new' }).click()
    await page.getByLabel('title').fill('Test blog')
    await page.getByLabel('author').fill('Test Author')
    await page.getByLabel('url').fill('https://example.com')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByRole('link', { name: /Test blog/ })).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    //make blog
    await page.getByRole('link', { name: 'create new' }).click()
    await page.getByLabel('title').fill('Blog to random')
    await page.getByLabel('author').fill('Test Author')
    await page.getByLabel('url').fill('https://example.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', { name: /Blog to random/ }).click()

    await expect(page.getByText('likes 0')).toBeVisible()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('a logged-in user can delete a blog', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    //make blog
    await page.getByRole('link', { name: 'create new' }).click()
    await page.getByLabel('title').fill('Blog to delete')
    await page.getByLabel('author').fill('Test Author')
    await page.getByLabel('url').fill('https://example.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', { name: /Blog to delete/ }).click()

    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'delete' }).click()

    await expect(page.getByRole('link', { name: /Blog to delete/ })).not.toBeVisible()
  })

  test('login form is shown on the login route', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
})