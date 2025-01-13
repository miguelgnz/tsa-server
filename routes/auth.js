import express from 'express'

import { AuthModel } from '../models/auth.js'

export const router = express.Router()

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
      // Cookie not appearing in dev tools > Application > Cookies
      res
        .cookie('access-token', result.token, {
          httpOnly: true, // The cookie only accessible by the web server
          secure: process.env.NODE_ENV === 'production', // Cookie only sent in HTTPS
          sameSite: 'strict', // The cookie is not sent with cross-origin requests
          maxAge: 3600
        })
        .send(result)
    })
    .catch((err) => {
      res.status(400).json({ error: err.message })
    })
})

// Logout route
router.post('/logout', (req, res) => {})
