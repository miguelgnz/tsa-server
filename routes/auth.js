import express from 'express'
import jwt from 'jsonwebtoken'

import { AuthModel } from '../models/auth.js'

export const router = express.Router()

export const verifyToken = (req, res, next) => {
  const token = req.cookies['access-token']

  if (!token) {
    return res.status(401).json({ error: 'Access denied' })
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_JWT_KEY)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' })
  }
}

// Register route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body

  await AuthModel.register(username, password, email)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.status(400).json({ error: err.message })
    })
})

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body

  AuthModel.login(email, password)
    .then((result) => {
      res
        .cookie('access-token', result.token, {
          httpOnly: true, // The cookie only accessible by the web server
          secure: process.env.NODE_ENV === 'production', // Cookie only sent in HTTPS
          sameSite: 'strict', // The cookie is not sent with cross-origin requests
          maxAge: 15 * 60 * 1000 // Cookie expires in 15
        })
        .send(result)
    })
    .catch((err) => {
      res.status(400).json({ error: err.message })
    })
})

// Logout route
router.post('/logout', (req, res) => {})

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route' })
})
