import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async ({ title, author, url, likes }) => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlog = {
    title: title,
    author:  author,
    url: url,
    likes: likes
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export default { getAll, setToken, create }