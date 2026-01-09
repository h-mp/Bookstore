/**
 * Defines the HomeController class.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

export class HomeController {
  /**
   * Renders the home page.
   */
  index (req, res, next) {
    res.render('home/index')
  }
}