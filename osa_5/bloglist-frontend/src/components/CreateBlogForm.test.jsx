import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import  CreateBlogForm  from './CreateBlogForm'

test('addblog is created with correct data', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlogForm addBlog={addBlog} />)

  const titleinput = screen.getByLabelText('title')
  const authorinput = screen.getByLabelText('author')
  const urlinput = screen.getByLabelText('url')
  const createbutton = screen.getByText('create')

  await user.type(titleinput, 'Test blog')
  await user.type(authorinput, 'Test Author')
  await user.type(urlinput, 'https://example.com')

  await user.click(createbutton)

  expect(addBlog.mock.calls).toHaveLength(1)

  expect(addBlog.mock.calls[0][0]).toEqual({
    title: 'Test blog',
    author: 'Test Author',
    url: 'https://example.com'
  })
})