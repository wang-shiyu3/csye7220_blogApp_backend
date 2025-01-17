const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const Users = require('../../models/Users')



// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
    check('email', 'Please include a valid email')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }
    
    const { name, email, password } = req.body

    try {
      let user = await Users.findOne({ email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists.' }] })
      }

      user = new Users({
        name,
        email,
        password,
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save(function(err) {
        if (err) {
          res.status(500)
            .send("Error registering new user please try again.");
        }
      });


      const payload = { user: {
        id: user.id
      } };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )      
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
