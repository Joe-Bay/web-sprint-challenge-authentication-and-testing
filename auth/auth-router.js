const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router();
const Users = require('../users/users-model')


router.post('/register', (req, res) => {
  const credentials = req.body

  if(credentials) {
    const iterations = process.env.BCRYPT_ITERATIONS || 8

    const hash = bcrypt.hashSync(credentials.password, iterations)

    credentials.password = hash

    Users.add(credentials)
    .then(user => {
      res.status(201).json({data: user})
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
  } else {
    res.status(400).json({
      message: "Please provide username and password"
    })
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if(req.body) {
    Users.findBy({ username: username })
    .then(([user]) => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = makeJwt(user)

        res.status(200).json({ token })
      } else {
        res.status(401).json({ message: "Invalid Credentials" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
  } else {
    res.status(400).json({ message: "please provide name and password" })
  }
});

function makeJwt({ username, id }) {
  const payload = {
    username, 
    subject: id
  }
  const config = {
    jwtSecret: process.env.JWT_SECRET || 'a very good secret'
  }
  const options = {
    expiresIn: '8 hours'
  }

  return jwt.sign(payload, config.jwtSecret, options)
}

module.exports = router;
