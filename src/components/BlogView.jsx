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
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        likes {blog.likes}{' '}
        {canLike && <button type="button" onClick={handleLike}>like</button>}
      </div>
      <div>added by {blog.user?.name ?? blog.user?.username ?? ''}</div>
      {showDelete && <button type="button" onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default BlogView
