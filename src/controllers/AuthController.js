/**
 * Defines the AuthController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import bcrypt from 'bcryptjs'
import { db } from '../config/mysql_config.js' 
import validator from 'validator'

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Displays a login form.
   *
   * @param {object} req  - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  login (req, res, next) {
    if (req.session.userId) {
      // If the user is logged in, redirect them to the home page.
      res.redirect(`/books`)
    } else {
      res.render('./auth/login')
    }
  }

  /**
   * Handles a login form submission.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express next middleware function.
   */
  async loginPost (req, res, next) {
    try {
      const { email, password } = req.body
      
      // If the username or password is not provided, throw an error.
      if (!email || !password) {
        throw new Error('Email and password are required.')
      }

      const normalizedEmail = (email.trim().toLowerCase())

      // Retrieve the user from the database.
      const query = 'SELECT userid, fname, lname, password FROM Members WHERE email = ?'
      const [results] = await db.query(query, [normalizedEmail])
      
      const user = results[0]
      if (!user) {
        throw new Error('Invalid email or password.')
      }

      // Compare passwords.
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new Error('Invalid email or password.')
      }

      console.log(`User ${user.userid} logged in.`)

      // Regenerate the session and redirect the user to the home page.
      req.session.regenerate(async () => {
        req.session.userId = user.userid
       req.session.flash = { type: 'success', text: `Welcome ${user.fname} ${user.lname}!`}
        res.redirect('/books')
      })
    } catch (error) {
      req.session.flash = { type: 'error', text: 'Invalid email or password.' }
      res.redirect('./login')
    }
  }

  /**
   * Logs out the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  logout (req, res, next) {
    if (req.session.userId) {
      // If the user is logged in, destroy the session.
      req.session.destroy(err => {
        if (err) {
          return next(err)
        }

        // Redirect the user to the home page.
        res.redirect(`/`)
      })
    } else {
      res.redirect(`/`)
    }
  }

  /**
   * Displays a registration form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  register (req, res, next) {
    if (req.session.userId) {
      // If the user is logged in, redirect them.
      res.redirect('./books')
    } else {
      res.render('./auth/register')
    }
  }

  /**
   * Handles a registration form submission.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express next middleware function.
   */
  async registerPost (req, res, next) {
    try {
      const { fname, lname, address, city, zip, phone, email, password } = req.body

      // If the username or password is not provided, throw an error.
      if (!fname || !lname || !address || !city || !zip || !email || !password) {
        throw new Error('Fill in all required fields.')
      }

      const normalizedEmail = email.trim().toLowerCase()

      // Validate email format
      if (!validator.isEmail(normalizedEmail) || normalizedEmail.length > 40) {
        throw new Error('Invalid email format.')
      }

      // Validate password length (must be at least 6 characters)
      if (!validator.isLength(password, { min: 6, max: 200 })) {
        throw new Error('Password must be at least 6 characters long.')
      }

      // Simple zip code format validation (e.g., 12345 or 123 45)
      if (!/^\d{3}\s?\d{2}$/.test(zip.trim())) {
        throw new Error('Invalid zip code format.')
      }

      const hashedPassword = await bcrypt.hash(password, 8)

      // Insert the new member into the database.
      const query = `INSERT INTO Members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(query, [fname, lname, address, city, zip, phone, normalizedEmail, hashedPassword])

      req.session.flash = { type: 'success', text: 'Registration successful. You can now log in.' }
      res.redirect('./login')
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        req.session.flash = { type: 'error', text: 'Try another email address.'}
        res.redirect('./register')
      } else if (error.message === 'Fill in all required fields.' ||
                 error.message === 'Invalid email format.' ||
                 error.message === 'Password must be at least 6 characters long.' ||
                 error.message === 'Invalid zip code format.') {
        req.session.flash = { type: 'error', text: error.message }
        res.redirect('./register')
      } else {
        return next(error)
      }
    }
  }
}
