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
}