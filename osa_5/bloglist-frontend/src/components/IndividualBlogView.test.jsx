import { render, screen } from '@testing-library/react'
import IndividualBlogView from './IndividualBlogView'

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => vi.fn()
}))

const blog = {
  id: '1',
  title: 'Test blog',
  author: 'Test author',
  url: 'https://example.com',
  likes: 3,
  user: {
    name: 'Test user',
    username: 'testuser'
  }
}

test('logged out user sees blogs and likes but no buttons', () => {
  render(
    <IndividualBlogView
      blogs={[blog]}
      addLike={vi.fn()}
      deleteBlog={vi.fn()}
      user={null}
    />
  )

  expect(screen.getByText('Test blog Test author')).toBeVisible()
  expect(screen.getByText('https://example.com')).toBeVisible()
  expect(screen.getByText('likes 3')).toBeVisible()
  expect(screen.queryAllByRole('button')).toHaveLength(0)
})

test('logged in non-creator sees only the like button', () => {
  render(
    <IndividualBlogView
      blogs={[blog]}
      addLike={vi.fn()}
      deleteBlog={vi.fn()}
      user={{ name: 'Another user', username: 'anotheruser' }}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getAllByRole('button')).toHaveLength(1)
})

test('blog creator sees like and delete buttons', () => {
  render(
    <IndividualBlogView
      blogs={[blog]}
      addLike={vi.fn()}
      deleteBlog={vi.fn()}
      user={{ name: 'Test user', username: 'testuser' }}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'delete' })).toBeVisible()
  expect(screen.getAllByRole('button')).toHaveLength(2)
})