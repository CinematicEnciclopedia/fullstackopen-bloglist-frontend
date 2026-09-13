import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  await user.type(screen.getByLabelText('title'), 'testing a form...')
  await user.type(screen.getByLabelText('author'), 'Samantha')
  await user.type(screen.getByLabelText('url'), 'https://example.com/test')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testing a form...',
    author: 'Samantha',
    url: 'https://example.com/test'
  })
})
