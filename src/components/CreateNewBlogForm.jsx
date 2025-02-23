const CreateNewBlogForm = ({ 
    onSubmit, 
    title, 
    author, 
    url, 
    likes,
    onTitleChange,
    onAuthorChange,
    onUrlChange,
    onLikesChange  
}) => {

    return (
        <div>
            <form onSubmit={ onSubmit }>
                <div>
                    title: 
                    <input
                        type="text"
                        value={ title }
                        name="Title"
                        onChange={ onTitleChange }
                    />
                </div>
                <div>
                    author: 
                    <input
                        type="text"
                        value={ author }
                        name="Author"
                        onChange={ onAuthorChange }
                    />
                </div>
                <div>
                    url: 
                    <input
                        type="url"
                        value={ url }
                        name="URL"
                        onChange={ onUrlChange }
                    />
                </div>
                <div>
                    likes: 
                    <input
                        type="number"
                        value={ likes }
                        name="Likes"
                        onChange={ onLikesChange }
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
    
}

export default CreateNewBlogForm