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
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    // Fetch distinct subjects for the dropdown
    const subjectQuery = 'SELECT DISTINCT subject FROM books ORDER BY subject ASC'
    const [subjects] = await db.query(subjectQuery)

    res.render('books/search', {subjects})
  }

  /**
   * Searches for books based on query parameters.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async search (req, res, next) {
    try {
      // Fetch  subjects for the dropdown.
      const [subjects] = await db.query('SELECT DISTINCT subject FROM books ORDER BY subject ASC')

      const { subject, author, title, itemsPerPage } = req.query

      // Validate and sanitize input.
      if (!subject) {
        throw new Error('Subject is required')
      }

      const sanitizedAuthor = (author && author.trim()) || undefined
      const sanitizedTitle  = (title  && title.trim())  || undefined

      // Build the SQL query dynamically based on provided parameters.
      let queryPart = 'WHERE subject LIKE ?'
      let queryParams = [subject.toLowerCase()]

      if (sanitizedAuthor) {
        queryPart += ' AND author LIKE ?'
        queryParams.push(sanitizedAuthor.toLowerCase() + '%')
      }

      if (sanitizedTitle) {
        queryPart += ' AND title LIKE ?'
        queryParams.push('%' + sanitizedTitle.toLowerCase() + '%')
      }

      // Get total page count for pagination.
      const totalPageQuery = 'SELECT COUNT(*) AS total FROM books ' + queryPart
      const [result] = await db.query(totalPageQuery, queryParams)
      const total = result[0].total

      // Pagination parameters.
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(itemsPerPage) || 5, 20);
      const offset = (page - 1) * limit;

      const totalPages = Math.ceil(total / limit)

      // Query for books with pagination.
      let fullQuery = 'SELECT * FROM books ' + queryPart + ' LIMIT ? OFFSET ?'
      queryParams.push(limit, offset)
      const [books] = await db.query(fullQuery, queryParams)

      res.render('books/search', { books, page, totalPages, subjects, query: req.query })
    } catch (error) {
      req.session.flash = {type: 'error', text: 'An error occurred while searching for books'}
      res.redirect('/books')
    }
  }
}