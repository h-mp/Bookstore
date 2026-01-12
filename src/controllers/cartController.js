/**
 * Defines the CartController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import { db } from '../config/mysql_config.js' 

export class CartController {
  /**
   * Renders the shopping cart page.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async index (req, res, next) {
    try {
      const userId = req.session.userId
      if (!userId) {
        throw new Error('User not logged in')
      }

      // Fetch cart items for the user
      const query = "SELECT c.isbn, b.title, b.price, c.qty " 
      + "FROM Cart c " 
      + "JOIN Books b ON c.isbn = b.isbn "
      + "WHERE userId = ?"
      const [cartItems] = await db.query(query, [userId])

      let grandTotal = 0

      if (cartItems && cartItems.length > 0) {
        // Calculate total for each item and the grand total
        cartItems.forEach(item => {
          item.total = (item.price * item.qty).toFixed(2)
          grandTotal += parseFloat(item.total)
        })

        grandTotal = grandTotal.toFixed(2)
      }

      res.render('cart/index', { cartItems, grandTotal })
    } catch (error) {
      if (error.message === 'User not logged in') {
        res.redirect('/login')
      } else {
        next(error)
      }
    }
  }

  /**
   * Adds a book to the shopping cart.
   * 
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async addToCart (req, res, next) {
    try {
      const { isbn, quantity } = req.body
      const userId = req.session.userId

      // Validate input
      if (!userId) {
        throw new Error('User not logged in')
      }

      if (!isbn || !quantity || isNaN(quantity) || quantity <= 0 || quantity > 100) {
        throw new Error('Invalid ISBN or quantity')
      }

      // Check if the book is already in the cart
      const cartCheckQuery = "SELECT qty FROM Cart WHERE userId = ? AND isbn = ?"
      const [existingItems] = await db.query(cartCheckQuery, [userId, isbn])

      if (existingItems && existingItems.length > 0) {
        // Update quantity if the item already exists
        const updateQuery = "UPDATE Cart SET qty = ? WHERE userId = ? AND isbn = ?"

        const updatedQuantity = parseInt(existingItems[0].qty) + parseInt(quantity)
        await db.query(updateQuery, [updatedQuantity, userId, isbn])
      } else {
        // Insert new item into the cart
        const insertQuery = "INSERT INTO Cart (userId, isbn, qty) VALUES (?, ?, ?)"
        await db.query(insertQuery, [userId, isbn, quantity])
      }

      req.session.flash = {type: 'success', text: 'Book was added to the cart'}
      res.redirect('/books')
    } catch (error) {
      if (error.message === 'User not logged in') {
        res.redirect('/login')
      } else {
        req.session.flash = {type: 'error', text: "An error occurred while adding the book to the cart"}
        res.redirect('/books')
      }
    }
  }
}