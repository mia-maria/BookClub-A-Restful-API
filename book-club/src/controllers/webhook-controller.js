/**
 * Webhook controller.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Webhook } from '../models/webhook.js'

/**
 * Represents a webhook-controller.
 */
export class WebhookController {
  /**
   * Registers a webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      await Webhook.insert({
        url: req.body.url,
        token: req.body.token,
        member: req.member.id
      })
      res
        .status(201)
        .json({
          links: [
            {
              href: process.env.URL + '/book-club/book-posts',
              rel: 'View all book-posts available'
            },
            {
              href: process.env.URL + '/authorisation/login',
              rel: 'Authorise as a member in the Book-Club'
            }
          ]
        })
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }
}
