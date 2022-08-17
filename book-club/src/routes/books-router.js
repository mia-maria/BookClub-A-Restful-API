
/**
 * Routes based on example "Restful Tasks With JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { BookController } from '../controllers/book-controller.js'
import { WebhookController } from '../controllers/webhook-controller.js'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { readFileSync } from 'fs'

export const router = express.Router()

const controller = new BookController()
const webhookController = new WebhookController()

/**
 * Authenticates requests.
 *
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization?.split(' ')
  if (authorization?.[0] !== 'Bearer') {
    next(createError(401))
    return
  }
  try {
    const key = readFileSync('./public.pem', 'utf8')
    const payload = jwt.verify(authorization[1], key, {
      algorithm: 'RS256',
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    })
    req.member = {
      id: payload.sub,
      name: payload.name
    }
    next()
  } catch (err) {
    next(createError(403))
  }
}

// If the route path includes id, req.book is added to the route.
router.param('id', (req, res, next, id) => controller.loadBook(req, res, next, id))

// GET all book posts. Available for authenticated members.
router.get('/', authenticateJWT, (req, res, next) => controller.findAll(req, res, next))

// GET one specific book post
router.get('/:id', authenticateJWT, (req, res, next) => controller.find(req, res, next))

// POST books
router.post('/', authenticateJWT, (req, res, next) => controller.create(req, res, next))

// POST register webhook
router.post('/register-webhook', authenticateJWT, (req, res, next) => webhookController.register(req, res, next))

// PUT books/:id
router.put('/:id', authenticateJWT, (req, res, next) => controller.update(req, res, next))

// PATCH books/:id
router.patch('/:id', authenticateJWT, (req, res, next) => controller.updatePart(req, res, next))

// DELETE books/:id
router.delete('/:id', authenticateJWT, (req, res, next) => controller.delete(req, res, next))
