const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const Comments = require('../../models/Comments')
const Blogs = require('../../models/Blogs')

// @route    POST api/comments/addorupdate/:blog_id
// @desc     Create or Update a Comment in a blog
// @access   Private
router.post(
  '/addorupdate/:blog_id',
  [
    auth,
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check(
      'text',
      'Please enter a paragraph with 10 or more characters'
    ).isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, text } = req.body

    const commentField = {}
    if (name) commentField.name = name
    if (text) commentField.text = text

    try {
      let comment = await Comments.findOneAndUpdate(
        { name },
        {
          user: req.user.id,
          $set: commentField,
          blog: req.params.blog_id,
        },
        { new: true, upsert: true }
      )

      const returnPack = await comment.save()

      res.json(returnPack)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route    GET api/comments/:blog_id
// @desc     Get all comments from one blog
// @access   Public
router.get('/:blog_id', async (req, res) => {
  try {
    const comments = await Comments.find({ blog: req.params.blog_id })
    res.json(comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// // @route    GET api/comments/user/:user_id
// // @desc     Get comments by user ID
// // @access   Public
// router.get('/user/:user_id', async (req, res) => {
//   try {
//     const comments = await Comments.find({ user: req.params.user_id })
//     res.json(comments)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send('Server Error')
//   }
// })

// @route    DELETE api/comments/:comment_id
// @desc     Delete a comment
// @access   Private
router.delete('/:comment_id', auth, async (req, res) => {
  try {
    const comment = await Comments.findOneAndDelete({
      _id: req.params.comment_id,
    })

    res.json(comment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
