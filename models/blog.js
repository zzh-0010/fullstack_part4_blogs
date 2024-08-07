const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URL

console.log('connecting to...', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MONGODB')
    })
    .catch(error => {
        console.log('error connecting to MONGODB..', error.message)
    })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
