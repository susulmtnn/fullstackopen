import { useParams, useNavigate } from 'react-router-dom'


const IndividualBlogView = ({ blogs, addLike, deleteBlog, user }) => {
  const id = useParams().id
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(blog)
      navigate('/')
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>{blog.url}</div>

      <div>
        likes {blog.likes}
        {user && (
          <button onClick={() => addLike(blog)}>
            like
          </button>
        )}
      </div>

      <div>added by {blog.user?.name}</div>

      {user && blog.user?.username === user.username && (
        <button onClick={handleDelete}>
          delete
        </button>
      )}
    </div>
  )
}
export default IndividualBlogView