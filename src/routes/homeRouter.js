/**
 * Defines the home router.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

export const router = express.Router()

const controller = new HomeController()

// Routes for the home page.
router.get('/', (req, res, next) => controller.index(req, res, next))