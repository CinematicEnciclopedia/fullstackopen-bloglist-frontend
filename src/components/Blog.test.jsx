import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
  likes: 0,
  user: { username: 'daniel', name: 'Daniel Arenas Sedano', id: 'abc123' }
}

const loggedUser = { username: 'daniel', name: 'Daniel Arenas Sedano' }

describe('<Blog />', () => {
  test('renders title and author, but not url or likes by default', () => {
    const { container } = render(
      <Blog blog={blog} user={loggedUser} updateBlog={vi.fn()} deleteBlog={vi.fn()} />
    )

    expect(
      screen.getByText('Component testing is done with react-testing-library', { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByText('Matti Luukkainen', { exact: false })).toBeInTheDocument()
    expect(container.querySelector('.blog-details')).toBeNull()
  })

  test('shows url and likes after clicking the view button', async () => {
    const { container } = render(
      <Blog blog={blog} user={loggedUser} updateBlog={vi.fn()} deleteBlog={vi.fn()} />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    expect(container.querySelector('.blog-details')).not.toBeNull()
    expect(
      screen.getByText('https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
    ).toBeInTheDocument()
    expect(screen.getByText(/likes 0/)).toBeInTheDocument()
  })

  test('clicking the like button twice calls the event handler twice', async () => {
    const updateBlog = vi.fn()

    render(
      <Blog blog={blog} user={loggedUser} updateBlog={updateBlog} deleteBlog={vi.fn()} />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
