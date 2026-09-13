import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Blog for view testing',
  author: 'Matti Luukkainen',
  url: 'https://example.com/view-test',
  likes: 5,
  user: { id: 'creator-id', username: 'creator', name: 'Creator Name' }
}

const renderBlogView = (user, updateBlog = vi.fn(), deleteBlog = vi.fn()) => {
  render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route path="/blogs/:id" element={
          <BlogView
            blogs={[blog]}
            user={user}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        } />
      </Routes>
    </MemoryRouter>
  )

  return { updateBlog, deleteBlog }
}

describe('<BlogView />', () => {
  test('unauthenticated user sees the blog info and likes, but no buttons', () => {
    renderBlogView(null)

    expect(screen.getByText('Blog for view testing', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('https://example.com/view-test')).toBeInTheDocument()
    expect(screen.getByText(/likes 5/)).toBeInTheDocument()
    expect(screen.queryByText('like')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('authenticated non-creator sees only the like button', () => {
    renderBlogView({ id: 'other-id', username: 'other', name: 'Other User' })

    expect(screen.getByText(/likes 5/)).toBeInTheDocument()
    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('the creator also sees the delete button', () => {
    renderBlogView({ id: 'creator-id', username: 'creator', name: 'Creator Name' })

    expect(screen.getByText('like')).toBeInTheDocument()
    expect(screen.getByText('remove')).toBeInTheDocument()
  })

  test('clicking the like button twice calls the event handler twice', async () => {
    const { updateBlog } = renderBlogView({ id: 'other-id', username: 'other', name: 'Other User' })

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
