const jwt = require('jsonwebtoken')
const config = require('config')

const withAuth = function(req, res, next) {
  // Get token from header
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}

module.exports = withAuth;
