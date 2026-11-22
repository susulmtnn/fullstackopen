import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}

        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>

        <button style={showWhenVisible} onClick={toggleVisibility}>
          cancel
        </button>
      </div>

      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button style={showWhenVisible} onClick={() => addLike(blog)}>like</button>
        </div>
        <div>{blog.user?.name}</div>
        {user && blog.user?.username === user.username && (
          <button onClick={() => deleteBlog(blog)}>
        delete
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
