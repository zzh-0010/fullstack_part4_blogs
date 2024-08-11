//目前app负责连接数据库并进行路由（具体路由程序在其他文件里）

const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleWares = require('./utils/middleWares')
const login = require('./controllers/login')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URL

logger.info('connecting to...', url)

mongoose.connect(url)
    .then(result => {
        logger.info('Connected to MONGODB')
    })
    .catch(error => {
        logger.error('error connecting to MONGODB..', error.message)
    })

app.use(express.json())
app.use(cors())
app.use(middleWares.tokenExtractor)
app.use('/api/blogs', middleWares.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleWares.errorHandler)

module.exports = app
