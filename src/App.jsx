import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimer = useRef(null)

  const showNotification = (message, type = 'success') => {
    if (notificationTimer.current) window.clearTimeout(notificationTimer.current)
    setNotification({ message, type })
    notificationTimer.current = window.setTimeout(() => {
      setNotification(null)
      notificationTimer.current = null
    }, 5000)
  }

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      } catch {
        showNotification('Could not load blogs', 'error')
      }
    }
    loadBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (error) {
      const message = error.response?.data?.error ?? 'Login failed'
      showNotification(message, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(createdBlog))
      showNotification('a new blog ' + createdBlog.title + ' by ' + createdBlog.author + ' added')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      const message = error.response?.data?.error ?? 'Could not create blog'
      showNotification(message, 'error')
    }
  }

  if (user === null) {
    return (
      <main>
        <h1>Blog list</h1>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <label>
            username
            <input
              id="username"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            password
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit">login</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <h1>Blog list</h1>
      <Notification notification={notification} />
      <p>
        {user.name} logged in{' '}
        <button type="button" onClick={handleLogout}>logout</button>
      </p>

      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <label>
          title
          <input
            id="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </label>
        <label>
          author
          <input
            id="author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          url
          <input
            id="url"
            name="url"
            type="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </label>
        <button type="submit">create</button>
      </form>

      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </main>
  )
}

export default App
