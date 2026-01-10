/**
 * Defines the book router.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { BookController } from '../controllers/bookController.js'

export const router = express.Router()

const controller = new BookController()

// Routes for the book search page.
router.get('/', (req, res, next) => controller.index(req, res, next))