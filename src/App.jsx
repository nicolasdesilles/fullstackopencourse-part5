import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateNewBlogForm from './components/CreateNewBlogForm'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  //state
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //references
  const createNewBlogFormRef = useRef()

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

      setSuccessMessage(`successfully logged in as ${user.username}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.error('login failed: wrong credentials')
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log(`logging out user ${user.name}`)
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)

    setSuccessMessage('successfully logged out')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleCreateNewBlog = async (newBlog) => {

    try {
      const addedBlog = await blogService.create({ 
        title: newBlog.title,
        author: newBlog.author, 
        url: newBlog.url
      })
      //console.log(addedBlog)

      const refeshedBlogsList = await blogService.getAll()
      setBlogs(refeshedBlogsList)

      createNewBlogFormRef.current.toggleVisibility()

      setSuccessMessage(`successfully added blog '${addedBlog.title}' by '${addedBlog.author}'`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

    }
    catch (exception) {
      console.error('adding a blog failed: ', exception.response.data)
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
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

        <Togglable buttonLabel='create new blog' ref={ createNewBlogFormRef }>

          <h2>create a new blog entry</h2>

          <CreateNewBlogForm
            createNewBlogEntry={ handleCreateNewBlog }
          />

        </Togglable>
        

        <h2>blogs list</h2>
        
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}

      </div>
    )
  }

  return (
    <div>

      <SuccessNotification message={ successMessage }/>
      <ErrorNotification message={ errorMessage }/>

      { user === null ?
        renderLoginForm() :
        renderBlogsList()
      }
    </div>
  )
}

export default App