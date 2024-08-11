const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user',{username:1, name:1})
    response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response) => {
    const body = request.body
    console.log("authPost body",request.token)

    if(request.token === undefined){
        return response.status(401).json({error: 'You need a token'})
    } 

    const user = request.user

    console.log('user.blogs', user.blogs)

    const blog = new Blog({...body, user:user.id})

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(blog)
    }
    catch (error){
        console.log(error)
        response.status(400).end()
    }
  })

blogsRouter.delete('/:id',async (request, response) => {
    //const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log("request.params.id", request.params.id)
    /*if(!decodedToken.id){  //解码不成功
        return response.status(401).json({error: 'token invalid'})
    }*/
    if(request.token === undefined){
        return response.status(401).json({error: 'You need a token'})
    } 

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() === user.id.toString()){
        try{
            await Blog.findByIdAndDelete(request.params.id)
            response.status(204).json(blog)
        }
        catch (error) {
            console.log(error)
        }
    }
    else {
        return response.status(401).json({error: 'you are not the user'})
    }
})

blogsRouter.put('/:id', async(request, response) => {
    const {likes} = request.body
    console.log(request.body)
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, 
            {likes}, {new: true}
        )
        response.json(updatedBlog)
    }
    catch (error) {

    }
})

module.exports = blogsRouter