
import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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