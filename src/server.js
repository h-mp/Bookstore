/**
 * The starting point of the application.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import 'dotenv/config'
import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'
import session from 'express-session'
import logger from 'morgan'
import helmet from 'helmet'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import { db } from './config/mysql_config.js'

try {
  // Test database connection 
  db.getConnection()
    .then(() => console.log('Database connected successfully'))
    .catch(err => {
      console.error('Database connection failed:', err)
      process.exitCode = 1
    })

  // Get the path of the current module's directory.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set the base URL to use for all relative URLs in the document.
  const baseURL = process.env.BASE_URL || '/'
  console.log(baseURL)

  const app = express()

  // Set up security-related HTTP headers.
  app.use(helmet())

  // Set up Content Security Policy (CSP) headers.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }))

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressEjsLayouts)

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // // Setup and use session middleware (https://github.com/expressjs/session)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }

  app.use(session(sessionOptions))

  app.locals.baseURL = baseURL

  // Middlewares to run before routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    next()
  })

  app.use((req, res, next) => {
    res.locals.userId = req.session.userId
    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
  // 404 Not Found.
    if (err.status === 404) {
      res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))

      return
    }

    // 403 Forbidden.
    if (err.status === 403) {
      res
        .status(403)
        .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))

      return
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (process.env.NODE_ENV === 'production') {
      res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Render the error page.
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })

} catch (error) {
  console.error(error)
  process.exitCode = 1
}