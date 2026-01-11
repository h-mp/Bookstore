/**
 * Defines the BookController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import { db } from '../config/mysql_config.js' 

export class BookController {
  /**
   * Renders the book search page.
   */
  index (req, res, next) {
    res.render('books/search')
  }

  /**
   * Searches for books based on query parameters.
   */
  async search (req, res, next) {
    try {
      const { subject, author, title, itemsPerPage } = req.query

      // Validate and sanitize input
      if (!subject) {
        throw new Error('Subject is required')
      }

      const sanitizedSubject = subject.trim()
      const sanitizedAuthor = (author && author.trim()) || undefined
      const sanitizedTitle  = (title  && title.trim())  || undefined

      // Build the SQL query dynamically based on provided parameters
      let query = 'SELECT * FROM books WHERE subject LIKE ?'
      let queryParams = [`%${sanitizedSubject}%`]

      if (sanitizedAuthor) {
        query += ' AND author LIKE ?'
        queryParams.push('%' + sanitizedAuthor + '%')
      }

      if (sanitizedTitle) {
        query += ' AND title LIKE ?'
        queryParams.push('%' + sanitizedTitle + '%')
      }

      const offset = 0
      const limit = parseInt(itemsPerPage) || 5

      query += ' LIMIT ? OFFSET ?'
      queryParams.push(limit, offset)

      const [books] = await db.query(query, queryParams)

      res.render('books/search', { books })
    } catch (error) {
      next(error)
    }
  }
}