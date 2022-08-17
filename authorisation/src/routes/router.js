/**
 * Routes based on example "Restful Tasks With JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as accountRouter } from './account-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({
  message: 'Welcome to register and authorise yourself!',
  links: [
    {
      href: process.env.URL + '/authorisation/register',
      rel: 'Register as a member in the Book-Club'
    },
    {
      href: process.env.URL + '/authorisation/login',
      rel: 'Authorise as a member in the Book-Club'
    },
    {
      href: process.env.URL + '/book-club/book-posts',
      rel: 'View all book-posts available'
    }
  ]
}))
router.use('/', accountRouter)

// Catch 404-error.
router.use('*', (req, res, next) => next(createError(404)))
