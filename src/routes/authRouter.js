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

// Routes for logging in.
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.loginPost(req, res, next))

// Routes for logging out.
router.get('/logout', (req, res, next) => controller.logout(req, res, next))

// Routes for registering.
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.registerPost(req, res, next))
