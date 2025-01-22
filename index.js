import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { mongoConnect } from './database.js'
import { router as authRouter } from './routes/auth.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
// Cors middleware
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://mdt-ui.vercel.app',
      'https://mdt-ui-3tva-miguelgnzs-projects.vercel.app',
      'https://mdt-ui-3tva-git-main-miguelgnzs-projects.vercel.app',
      'https://mdt-ui-3tva-git-develop-miguelgnzs-projects.vercel.app'
    ],
    methods: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'],
    credentials: true
  })
)

app.use('/api/auth', authRouter)

mongoConnect((client) => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
})

export default app
