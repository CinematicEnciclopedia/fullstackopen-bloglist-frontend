import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {
      // L'avís d'error ja el mostra App; conservem els camps escrits per no perdre'ls.
    }
  }

  return (
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
  )
}

export default BlogForm
