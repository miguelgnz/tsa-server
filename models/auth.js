import { getDb } from '../database.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
// import jwt from 'jsonwebtoken'

export class AuthModel {
  static register = async (username, password, email) => {
    if (typeof username !== 'string') throw new Error('Invalid username')
    if (typeof password !== 'string') throw new Error('Invalid password')
    if (password.length < 8) throw new Error('Password is too short')
    if (username.length < 3) throw new Error('Username is too short')

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if the user already exists
    const db = getDb()

    return db
      .collection('users')
      .findOne({ username })
      .then((user) => {
        if (user) {
          throw new Error('User already exists')
        }
        return db.collection('users').insertOne({
          id: crypto.randomBytes(16).toString('hex'),
          username,
          password: hashedPassword,
          email,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
      .then((result) => {
        return { message: 'User created', id: result.insertedId, username }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  static login = async (username, password) => {
    if (typeof username !== 'string') throw new Error('Invalid username')
    if (typeof password !== 'string') throw new Error('Invalid password')

    const db = getDb()

    return db
      .collection('users')
      .findOne({ username })
      .then(async (user) => {
        if (!user) {
          throw new Error('User not found')
        }

        const match = bcrypt.compareSync(password, user.password)

        if (!match) {
          throw new Error('Wrong password')
        }

        // const token = jwt.sign({ id: user.id, username }, 'secret', {
        //   expiresIn: '1h'
        // })

        return { message: 'Login successful', username }
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}
