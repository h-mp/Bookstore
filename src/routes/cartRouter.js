/**
 * Defines the cart router.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { CartController } from '../controllers/cartController.js'

export const router = express.Router()

const controller = new CartController()

// Routes for the shopping cart.
router.get('/', (req, res, next) => controller.index(req, res, next))
