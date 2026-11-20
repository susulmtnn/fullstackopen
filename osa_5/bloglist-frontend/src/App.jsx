import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })


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
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = event => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = async event => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setErrorMessage(null)
    } catch {
      setErrorMessage('could not create blog')
    }
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

  const createBlogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input name="title" type="text"  value={newBlog.title} onChange={handleBlogChange} required />
        </label>
      </div>
      <div>
        <label>
          author
          <input name="author" type="text" value={newBlog.author} onChange={handleBlogChange} />
        </label>
      </div>
      <div>
        <label>
          url
          <input name="url" type="text" value={newBlog.url} onChange={handleBlogChange} required />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )


    return (
    <div>
      <h1>BlogsApp</h1>

      {!user && loginForm()}
      {user && (
        <div> <h1>Welcome {user.name}</h1>
        <button onClick={() => handleLogout()}>
          logout
        </button>
        {createBlogForm()}
        </div>
        )}
      <div>
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
          />
        ))}
      </div>
    </div>
  )
}

export default App