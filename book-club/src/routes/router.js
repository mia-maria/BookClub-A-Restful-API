/**
 * Routes based on example "Restful Tasks" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as booksRouter } from './books-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json(
  {
    message: 'Welcome to the Book Club!',
    links: [
      {
        href: process.env.URL + '/authorisation/register',
        rel: 'Register as a member in the Book-Club. Submit userName, email and password in json format.'
      },
      {
        href: process.env.URL + '/authorisation/login',
        rel: 'Authorise as a member in the Book-Club. Submit email and password in json format.'
      },
      {
        href: process.env.URL + '/book-club/book-posts',
        rel: 'View all book-posts available with GET. You can also create your own book-post with POST. Submit author, title, genre, description and evaluation in json format.'
      }
    ]
  }))
router.use('/book-posts', booksRouter)

router.use('*', (req, res, next) => next(createError(404)))
