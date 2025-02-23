import { useState, useEffect, useDeferredValue } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateNewBlogForm from './components/CreateNewBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  //state
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  //event handlers
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`login with username = ${username} and password = ${password}`)

    try {
      const user = await loginService.login(
        {
          username: username,
          password: password
        }
      )

      window.localStorage.setItem(
        'loggedBloglistAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      //console.log(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.error('login failed: wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log(`logging out user ${user.name}`)
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const addedBlog = await blogService.create({ 
        title: title,
        author: author, 
        url: url,
        likes: likes
      })
      console.log(addedBlog)

      const refeshedBlogsList = await blogService.getAll()
      setBlogs(refeshedBlogsList)

      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
    }
    catch (exception) {
      console.error('addind a blog failed: ', exception)
    }

  }

  //effect hooks
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  //components rendering functions
  const renderLoginForm = () => {
    return (
      <div>
        <h2>log in to the app</h2>
        <LoginForm 
            onSubmit={ handleLogin } 
            username={ username } 
            password={ password } 
            onUsernameChange={ ({ target }) => setUsername(target.value) }
            onPasswordChange={ ({ target }) => setPassword(target.value) }
          />
      </div>
    )
  }

  const renderBlogsList = () => {
    return (
      <div>

        <h1>blogs</h1>

        <div>
          User '{user.name}' is logged in
          <button onClick={ handleLogout }>logout</button>
        </div>

        <h2>create a new blog entry</h2>

        <CreateNewBlogForm
          onSubmit={ handleCreateNewBlog }
          title={ title }
          author={ author }
          url={ url }
          likes={ likes }
          onTitleChange={ ({ target }) => { setTitle(target.value) } }
          onAuthorChange={ ({ target }) => { setAuthor(target.value) } }
          onUrlChange={ ({ target }) => { setUrl(target.value) } }
          onLikesChange={ ({ target }) => { setLikes(target.value) } }
        />

        <h2>blogs list</h2>
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}

      </div>
    )
  }

  return (
    <div>
      { user === null ?
         renderLoginForm() :
         renderBlogsList()
      }
    </div>
  )
}

export default App