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

const create = async ({ title, author, url }) => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlog = {
    title: title,
    author:  author,
    url: url
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async ( updatedBlog ) => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlog = {
    title: updatedBlog.title,
    author:  updatedBlog.author,
    url: updatedBlog.url,
    likes: updatedBlog.likes
  }

  console.log('updating ', `${baseUrl}/${updatedBlog.id}`)

  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, newBlog, config)
  return response.data

}

export default { getAll, setToken, create, update }