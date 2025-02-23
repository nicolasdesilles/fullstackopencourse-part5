import { useState, useEffect, useDeferredValue } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'
import login from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //event handlers
  const handleLoginFormUsernameChange = (event) => {
    //console.log(event.target.value)
    setUsername(event.target.value)
  }

  const handleLoginFormPasswordChange = (event) => {
    //console.log(event.target.value)
    setPassword(event.target.value)
  }

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

  //effect hooks
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
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
            onUsernameChange={ handleLoginFormUsernameChange }
            onPasswordChange={ handleLoginFormPasswordChange}
          />
      </div>
    )
  }

  const renderBlogsList = () => {
    return (
      <div>
        <div>
          User '{user.name}' is logged in
          <button onClick={ handleLogout }>logout</button>
        </div>
        <h2>blogs</h2>
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