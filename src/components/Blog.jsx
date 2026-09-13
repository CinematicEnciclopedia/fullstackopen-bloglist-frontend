import { Link } from 'react-router-dom'

const Blog = ({ blog }) => (
  <div className="blog">
    {blog.title} {blog.author}{' '}
    <Link to={`/blogs/${blog.id}`}>view</Link>
  </div>
)

export default Blog
