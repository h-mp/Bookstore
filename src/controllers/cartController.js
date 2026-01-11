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
   */
  index (req, res, next) {
    res.render('cart/index')
  }
}