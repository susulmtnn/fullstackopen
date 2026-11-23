import { useState, useEffect, useRef, useImperativeHandle } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom'

const IndividualBlogView = ({ blogs, addLike, deleteBlog, user }) => {
  const id = useParams().id

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
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

      <div>
        added by {blog.user?.name}
      </div>

      {user && blog.user?.username === user.username && (
        <button onClick={() => deleteBlog(blog)}>
          delete
        </button>
      )}
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageColor, setMessageColor]= useState('red')
  const createBlogFormRef = useRef()
  


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setMessageColor('red')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const addLike = async blog => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    returnedBlog.user = blog.user
    // Here neew to find that blog and update it in frontend aerray
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === returnedBlog.id) {
        return returnedBlog
      }

      return blog
    })

    setBlogs(updatedBlogs)
  }


  const addBlog = async newBlog => {
    if (!newBlog.title.trim() || !newBlog.author.trim() || !newBlog.url.trim()) {
      setErrorMessage('Please fill all fields')
      setMessageColor('red')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    try {
      const createdBlog = await blogService.create(newBlog)
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      createBlogFormRef.current.toggleVisibility()
      setErrorMessage('New blog created')
      setMessageColor('green')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('could not create blog')
      setMessageColor('red')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async blog => {
    const confirmDelete = window.confirm(
      `Delete ${blog.title} by ${blog.author}?`
    )

    if (confirmDelete) {
      await blogService.delete_blog(blog.id)

      const remainingBlogs = blogs.filter(
        currentBlog => currentBlog.id !== blog.id
      )

      setBlogs(remainingBlogs)
    }
  }



  const Togglable = (props) => {
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

    useImperativeHandle(props.ref, () => {
      return {
        toggleVisibility
      }
    })

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={toggleVisibility}>
            {props.buttonLabel}
          </button>
        </div>

        <div style={showWhenVisible}>
          {props.children}

          <button onClick={toggleVisibility}>
          cancel
          </button>
        </div>
      </div>
    )
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
  const Notification = ({ message, color }) => {
    if (message) return (<div style={{ border:'3px solid',borderColor : color }}> {message} </div>)
    else return null
  }




  return (
  <Router>
    <div>
      <h1>BlogsApp</h1>

      <Notification
        message={errorMessage}
        color={messageColor}
      />

      <div>
        <Link to="/">blogs</Link>

        {!user && (
          <Link to="/login"> login</Link>
        )}

        {user && (
          <>
            {user.name} logged in
            <button onClick={() => handleLogout()}>
              logout
            </button>
          </>
        )}
      </div>

      <Routes>
        <Route
          path="/login"
          element={loginForm()}
        />
        <Route
        path="/blogs/:id"
        element={
        <IndividualBlogView
        blogs={blogs}
        addLike={addLike}
        deleteBlog={deleteBlog}
        user={user}
        />
        }
        />


        <Route
          path="/"
          element={
            <div>
              {blogs
              .slice()
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
              <div key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
              </Link>
              </div>
              ))}
            </div>
          }
        />
      </Routes>
    </div>
  </Router>
)   
}

export default App