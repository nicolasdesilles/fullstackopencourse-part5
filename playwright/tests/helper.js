const loginWith = async (page, username, password)  => {
  await page.getByTestId('login-username').fill(username)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-button').click()
}

const createBlog = async (page, title, author, url) => {

  await page.getByTestId('createblog-button').click()

  await page.getByTestId('newblogform-titleinput').fill(title)
  await page.getByTestId('newblogform-authorinput').fill(author)
  await page.getByTestId('newblogform-urlinput').fill(url)

  await page.getByTestId('newblogform-submitbutton').click()

  await page.getByText(`${title} by ${author}`).waitFor()

}

export { loginWith, createBlog }