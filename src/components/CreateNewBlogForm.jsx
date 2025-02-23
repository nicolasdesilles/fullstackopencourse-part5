import { useState } from 'react'

const CreateNewBlogForm = ({ createNewBlogEntry }) => {

    //state
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    //submit blog func
    const addNewBlog = (event) => {
        event.preventDefault()

        createNewBlogEntry(
            {
                title: title,
                author: author,
                url: url
            }
        )

        setTitle('')
        setAuthor('')
        setUrl('')

    }

    return (
        <div>
            <form onSubmit={ addNewBlog }>
                <div>
                    title: 
                    <input
                        type="text"
                        value={ title }
                        name="Title"
                        onChange={ ({ target }) => setTitle(target.value) }
                    />
                </div>
                <div>
                    author: 
                    <input
                        type="text"
                        value={ author }
                        name="Author"
                        onChange={ ({ target }) => setAuthor(target.value) }
                    />
                </div>
                <div>
                    url: 
                    <input
                        type="url"
                        value={ url }
                        name="URL"
                        onChange={ ({ target }) => setUrl(target.value) }
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
    
}

export default CreateNewBlogForm