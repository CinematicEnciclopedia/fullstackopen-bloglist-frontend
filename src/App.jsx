import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const notificationTimer = useRef(null)
  const navigate = useNavigate()

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

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      return true
    } catch (error) {
      const message = error.response?.data?.error ?? 'Login failed'
      showNotification(message, 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      return createdBlog
    } catch (error) {
      const message = error.response?.data?.error ?? 'Could not create blog'
      showNotification(message, 'error')
      throw error
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : updatedBlog)))
    } catch (error) {
      const message = error.response?.data?.error ?? 'Could not update blog'
      showNotification(message, 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog removed')
    } catch (error) {
      const message = error.response?.data?.error ?? 'Could not delete blog'
      showNotification(message, 'error')
    }
  }

  return (
    <main>
      <nav>
        <Link to="/">blogs</Link>
        {user && <Link to="/create">new blog</Link>}
        {user === null
          ? <Link to="/login">login</Link>
          : (
            <span className="nav-user">
              {user.name} logged in{' '}
              <button type="button" onClick={handleLogout}>logout</button>
            </span>
          )}
      </nav>

      <h1>Blog list</h1>
      <Notification notification={notification} />

      <Routes>
        <Route path="/blogs/:id" element={
          <BlogView
            blogs={blogs}
            user={user}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        } />
        <Route path="/create" element={
          // Si no hi ha sessio, tornem a la llista (no a /login): aixi el logout
          // desde qualsevol ruta sempre acaba a la llista i no competeix amb aquesta guarda.
          user ? <BlogForm createBlog={addBlog} /> : <Navigate replace to="/" />
        } />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </main>
  )
}

export default App
