/**
 * Account controller based on example "Restful Tasks With JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Member } from '../models/member.js'
import { readFileSync } from 'fs'

/**
 * Represents a controller.
 */
export class AccountController {
  /**
   * Authenticates a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const member = await Member.authenticate(req.body.email, req.body.password)
      const payload = {
        sub: member.id,
        name: member.userName
      }
      const key = readFileSync('./private.pem', 'utf8')
      const accessToken = jwt.sign(payload, key, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })
      res
        .status(200)
        .json({
          access_token: accessToken,
          links: [
            {
              href: process.env.URL + '/book-club/book-posts',
              rel: 'View all book-posts available'
            },
            {
              href: process.env.URL + '/authorisation/register',
              rel: 'Register as a member in the Book-Club'
            }
          ]
        })
    } catch (error) {
      const err = createError(401)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Registers a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const member = await Member.insert({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
      })
      res
        .status(201)
        .json({
          id: member.id,
          links: [
            {
              href: process.env.URL + '/authorisation/login',
              rel: 'Authorise as a member in the Book-Club'
            },
            {
              href: process.env.URL + '/book-club/book-posts',
              rel: 'View all book-posts available'
            }
          ]
        })
    } catch (error) {
      let err = error
      if (err.code === 11000) {
        // The email must be unique.
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }
}
