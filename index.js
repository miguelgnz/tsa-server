import express from 'express'

import { mongoConnect } from './database.js'
import { router as authRouter } from './routes/auth.js'

const app = express()
const port = 3000

app.use(express.json())

app.use('/api/auth', authRouter)

mongoConnect((client) => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
})
