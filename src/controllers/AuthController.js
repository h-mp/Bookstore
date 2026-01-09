/**
 * Defines the AuthController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import bcrypt from 'bcryptjs'
import { db } from '../config/mysql_config.js' 

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Displays a registration form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  register (req, res, next) {
    if (req.session.userId) {
      // If the user is logged in, redirect them to the home page.
      res.redirect(`${app.locals.baseURL}`)
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
      res.locals.errorMessage = 'All required fields must be filled.'
      return res.render('./auth/register')
      }
    
      // Validate password length
      if (password.length < 6) {
        res.locals.errorMessage = 'Password must be at least 6 characters long.'
        return  res.render('./auth/register')
      }

      // Simple zip code format validation (e.g., 12345 or 123 45)
      if (!/^\d{3}\s?\d{2}$/.test(zip.trim())) {
        res.locals.errorMessage = 'Invalid zip code format.'
        return res.render('./auth/register')
      }

      const hashedPassword = await bcrypt.hash(password, 8)

      // Insert the new member into the database.
      const query = `INSERT INTO Members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      const [results] = await db.query(query, [fname, lname, address, city, zip, phone, email, hashedPassword])

      res.locals.successMessage = 'Account created successfully. You can now log in.'
      res.render('./auth/register')
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.locals.errorMessage = 'Use another email address.'
        res.render('./auth/register')
      } else {
        return next(error)
      }
    }
  }
}
