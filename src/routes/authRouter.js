/**
 * Defines the authentication router.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import express from 'express'
import { AuthController } from '../controllers/AuthController.js'

export const router = express.Router()

const controller = new AuthController()

// Routes for registering.
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.registerPost(req, res, next))
