/**
 * The routes.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './homeRouter.js'
import { router as authRouter } from './authRouter.js'
import { router as bookRouter } from './bookRouter.js'
import { router as cartRouter } from './cartRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/auth', authRouter)
router.use('/books', bookRouter)
router.use('/cart', cartRouter)

// Catch 404 for all unmatched routes
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})