import { useState } from 'react'

import blogService from '../services/blogs'

const Blog = ({ blog, refreshBlogs }) => {

  const [visible, setVisible] = useState(false)

  const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
  const loggedUser = JSON.parse(loggedUserJSON)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const deleteButtonVisibility = { display: loggedUser.username === blog.user.username ? '' : 'none' }

  const blogStyle = {
    border: '2px outset #000000',
    padding: '5px',
    margin: '2px'
  }
  const detailsStyle = {
    margin: '5px'
  }
  const titleStyle = {
    fontWeight: 'bold'
  }
  const authorStyle = {
    fontStyle: 'italic'
  }
  const fieldNameStyle = {
    textDecoration: 'underline solid #000000'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLikeClicked = async (event) => {
    event.preventDefault()

    const newBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }

    await blogService.update(newBlog)

    refreshBlogs()

  }

  const onDeleteClicked = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog)
      refreshBlogs()
    }
  }

  return (
    <div style={ blogStyle }>
      <div style={ hideWhenVisible }>
        <div>
          <span style={ titleStyle }>{ blog.title }</span> by <span style={ authorStyle }>{ blog.author }</span>
          <span> <button onClick={ toggleVisibility }>view</button>  </span>
        </div>
      </div>
      <div style={ showWhenVisible }>
        <span style={ titleStyle }>{ blog.title }</span> by <span style={ authorStyle }>{ blog.author }</span>
        <span> <button onClick={ toggleVisibility }>hide</button>  </span>
        <div style={ detailsStyle }>
          <div>
            <span style={ fieldNameStyle }>url:</span> <span>{ blog.url }</span>
          </div>
          <div>
            <span style={ fieldNameStyle }>likes:</span> <span>{ blog.likes }</span> <span><button onClick={ onLikeClicked }>like</button></span>
          </div>
          <div>
            <span style={ fieldNameStyle }>added by:</span> <span>{ blog.user.name }</span>
          </div>
          <div>
            <span style={ deleteButtonVisibility }><button onClick={ onDeleteClicked }>remove</button></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog