import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('clicking like twice adds two likes', async () => {
  const blog = {
    title: 'Random title',
    author: 'Random Suvi',
    url: 'https://pizza.com/',
    likes: 3,
    user: {
      name: 'Suvi suvi',
      username: 'testsuvi'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      addLike={mockHandler}
    />
  )

  const user = userEvent.setup()

  const viewbutton = screen.getByText('view')
  await user.click(viewbutton)

  const likebutton = screen.getByText('like')

  await user.click(likebutton)
  await user.click(likebutton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})



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