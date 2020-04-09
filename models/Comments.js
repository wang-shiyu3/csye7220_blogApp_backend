const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blogs',
  },
  name: {
    type: String,
    required: true,
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

module.exports = Comments = mongoose.model('comments', CommentSchema)
