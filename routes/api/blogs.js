const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const Blogs = require('../../models/Blogs')
const Comments = require('../../models/Comments')

// @route    POST api/blogs/addorupdate
// @desc     Create or Update a Blog
// @access   Private
router.post(
  '/addorupdate',
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

    const { name, image, text } = req.body

    const blogField = {}
    if (name) blogField.name = name
    if (image) blogField.image = image
    if (text) blogField.text = text

    try {
      let blog = await Blogs.findOneAndUpdate(
        { name },
        { user: req.user.id, $set: blogField },
        { new: true, upsert: true }
      )

      const returnPack = await blog.save()

      res.json(returnPack)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route    GET api/blogs
// @desc     Get all blogs
// @access   Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blogs.find()
    res.json(blogs)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    GET api/blogs/user/:user_id
// @desc     Get blogs by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const blogs = await Blogs.find({ user: req.params.user_id })
    res.json(blogs)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route    DELETE api/blogs/:blog_id
// @desc     Delete blog and comments in blog
// @access   Private
router.delete('/:blog_id', auth, async (req, res) => {
  try {
    // Delete comments under the blog
    await Comments.deleteMany({ blogs: req.params.blog_id })

    const blog = await Blogs.findOneAndDelete({ _id: req.params.blog_id })

    // await blog.save()

    res.json(blog)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
