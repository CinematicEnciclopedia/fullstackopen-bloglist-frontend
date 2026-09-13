import { useNavigate, useParams } from 'react-router-dom'

const BlogView = ({ blogs, user, updateBlog, deleteBlog }) => {
  const id = useParams().id
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  const handleLike = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id ?? blog.user
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  const blogOwnerId = blog.user?.id ?? blog.user
  const showDelete = user && blogOwnerId && (
    user.id === blogOwnerId ||
    (blog.user?.username !== undefined && user.username === blog.user.username)
  )
  const canLike = Boolean(user)

  return (
    <div className="blog-details">
      <h2>{blog.title} by {blog.author}</h2>
      <div className="meta"><a href={blog.url}>{blog.url}</a></div>
      <div className="meta">likes {blog.likes}</div>
      <div className="meta">added by {blog.user?.name ?? blog.user?.username ?? ''}</div>
      <div className="actions">
        {canLike && (
          <button type="button" className="primary" onClick={handleLike}>like</button>
        )}
        {showDelete && (
          <button type="button" className="danger" onClick={handleDelete}>remove</button>
        )}
      </div>
    </div>
  )
}

export default BlogView
