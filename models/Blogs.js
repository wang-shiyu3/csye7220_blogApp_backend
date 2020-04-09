const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Blogs = mongoose.model('blogs', BlogSchema)
