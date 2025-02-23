import { useState } from 'react'

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : ''}
  const showWhenVisible = { display: visible ? '' : 'none'}

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
            <span style={ fieldNameStyle }>likes:</span> <span>{ blog.likes }</span> <span><button>like</button></span>
          </div>
          <div>
            <span style={ fieldNameStyle }>added by:</span> <span>{ blog.user.name }</span>
          </div>    
        </div>
      </div>
    </div>  
  )
  
}

export default Blog