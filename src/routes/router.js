/**
 * The routes.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './homeRouter.js'

export const router = express.Router()

router.use('/', homeRouter)

// Catch 404 for all unmatched routes
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})