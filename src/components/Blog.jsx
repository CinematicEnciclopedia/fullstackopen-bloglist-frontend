import { Link } from 'react-router-dom'

const Blog = ({ blog }) => (
  <div className="blog">
    <div>
      <span className="blog-title">{blog.title}</span>{' '}
      <span className="blog-author">{blog.author}</span>
    </div>
    <Link to={`/blogs/${blog.id}`}>view</Link>
  </div>
)

export default Blog
