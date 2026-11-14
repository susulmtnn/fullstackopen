const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')


const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
  title: body.title,
  author: body.author,
  url: body.url,
  likes: body.likes,
  user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user

    if (!user){
       return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (blog) {
      if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
      }

      return response.status(403).json({
        error: 'only the creator can delete the blog'
      })
    }

    return response.status(404).end()
})



module.exports = blogsRouter