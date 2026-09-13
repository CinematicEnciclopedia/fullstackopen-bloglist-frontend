import Blog from './Blog'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default BlogList
