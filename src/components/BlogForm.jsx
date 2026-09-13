import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    } catch {
      // L'avís d'error ja el mostra App; conservem els camps escrits per no perdre'ls.
    }
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  )
}

export default BlogForm
