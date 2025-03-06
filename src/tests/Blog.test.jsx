import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import axios from 'axios'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

describe('blog rendering', async () => {

  const response = await axios.get('http://localhost:3003/api/blogs/67ba3a1a7f352b4d4bc203bd')
  const blog = response.data

  test('renders blog title and author by default', async () => {

    render(<Blog blog={ blog } />)
    const titleElement = screen.getByTestId('blog-title')
    const authorElement = screen.getByTestId('blog-author')

    expect(titleElement).toHaveTextContent(blog.title)
    expect(authorElement).toHaveTextContent(blog.author)

  })

  test('does not render blog url and likes by default', async () => {

    render(<Blog blog={ blog } />)
    const urlElement = screen.getByTestId('blog-url')
    const likesElement = screen.getByTestId('blog-likes')

    expect(urlElement).not.toBeVisible()
    expect(likesElement).not.toBeVisible()

  })

  test('renders blog url and likes when the view button is clicked', async () => {

    const testUser = userEvent.setup()

    render(<Blog blog={ blog } />)
    const viewButton = screen.getByTestId('blog-viewbutton')

    await testUser.click(viewButton)

    const urlElement = screen.getByTestId('blog-url')
    const likesElement = screen.getByTestId('blog-likes')

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()


  })

  test('clicking the like button twice calls the event handler twice', async () => {

    const mockHandler = vi.fn()
    const testUser = userEvent.setup()

    render(<Blog blog={ blog } onLikeClicked={ mockHandler }/>)
    const viewButton = screen.getByTestId('blog-viewbutton')

    await testUser.click(viewButton)

    const likeButton = screen.getByTestId('blog-likebutton')

    expect(likeButton).toBeDefined()

    await testUser.click(likeButton)
    await testUser.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })


})



