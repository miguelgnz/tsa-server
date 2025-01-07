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
  const { username, password } = req.body

  AuthModel.login(username, password)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.status(400).json({ error: err.message })
    })
})

// Logout route
router.post('/logout', (req, res) => {})
