import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('url, likes and user visible after view button clicked', async () => {
  const blog = {
    title: 'Random title',
    author: 'Random author',
    url: 'https://cats.com/',
    likes: 22,
    user: {
      name: 'New name',
      username: 'newtestuser'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const viewbutton = screen.getByText('view')

  await user.click(viewbutton)

  expect(screen.getByText('https://cats.com/')).toBeVisible()
  expect(screen.getByText('likes 22', { exact: false })).toBeVisible()
  expect(screen.getByText('New name')).toBeVisible()
})

test('renders blog title', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('React patterns', { exact: false })

  expect(element).toBeDefined()
})