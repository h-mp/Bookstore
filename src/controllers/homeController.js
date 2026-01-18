/**
 * Defines the HomeController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

export class HomeController {
  /**
   * Renders the home page.
   * 
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }
}