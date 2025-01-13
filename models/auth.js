import { getDb } from '../database.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

export class AuthModel {
  static register = async (email, password) => {
    // Do correct validation FOR EMAIL
    if (typeof email !== 'string') throw new Error('Invalid email')
    if (typeof password !== 'string') throw new Error('Invalid password')
    if (password.length < 8) throw new Error('Password is too short')
    if (email.length < 3) throw new Error('Username is too short')

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if the user already exists
    const db = getDb()

    return db
      .collection('users')
      .findOne({ email })
      .then((user) => {
        if (user) {
          throw new Error('User already exists')
        }
        return db.collection('users').insertOne({
          id: crypto.randomBytes(16).toString('hex'),
          email,
          password: hashedPassword,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
      .then((result) => {
        return { message: 'User created', id: result.insertedId, email }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  static login = async (email, password) => {
    if (typeof email !== 'string') throw new Error('Invalid email')
    if (typeof password !== 'string') throw new Error('Invalid password')

    const db = getDb()

    return db
      .collection('users')
      .findOne({ email })
      .then(async (user) => {
        if (!user) {
          throw new Error('User not found')
        }

        const match = bcrypt.compareSync(password, user.password)

        if (!match) {
          throw new Error('Wrong password')
        }

        const token = jwt.sign(
          { id: user.id, email },
          process.env.SECRET_JWT_KEY,
          {
            expiresIn: '1h'
          }
        )

        return { message: 'Login successful', email, token }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}
