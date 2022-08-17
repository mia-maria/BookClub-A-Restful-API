/**
 * Module for the BookController based on example "Restful Tasks" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import createError from 'http-errors'
import fetch from 'node-fetch'
import { Book } from '../models/book.js'
import { Webhook } from '../models/webhook.js'

/**
 * Represents a BookController.
 */
export class BookController {
  /**
   * Add req.book to the route in case there is an :id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The id of the book.
   */
  async loadBook (req, res, next, id) {
    try {
      const book = await Book.getById(id)
      if (!book) {
        // Not found
        next(createError(404))
        return
      }
      // Add the book to req.
      req.book = book
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response including all book-posts.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const books = await Book.getAll()
      const result = []
      for (let i = 0; i < books.length; i++) {
        books[i] = {
          author: books[i].author,
          title: books[i].title,
          genre: books[i].genre,
          description: books[i].description,
          evaluation: books[i].evaluation,
          member: books[i].member,
          id: books[i].id
        }
        result.push(books[i])
      }
      const links = {
        links: [
          {
            href: process.env.URL + '/book-club/book-posts/register-webhook',
            rel: 'Register a webhook with POST to get information about newly created book-posts. You need to submit an url and a token in json format. The header PRIVATE-TOKEN is used when sending information about new book-posts.'
          },
          {
            href: process.env.URL + '/book-club/book-posts/{bookPostID}',
            rel: 'View a specific book post with GET or update or delete your own book-post with PUT, PATCH or DELETE.'
          }
        ]
      }
      result.push(links)
      res
        .status(200)
        .json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response with one book-post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const book = {
      author: req.book.author,
      title: req.book.title,
      genre: req.book.genre,
      description: req.book.description,
      evaluation: req.book.evaluation,
      member: req.book.member,
      links: [
        {
          href: process.env.URL + '/book-club/book-posts',
          rel: 'View all book-posts'
        }
      ]
    }
    res
      .status(200)
      .json(book)
  }

  /**
   * Creates a new book.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    const book = {
      author: req.body.author,
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description,
      evaluation: req.body.evaluation,
      memberId: req.member.id,
      member: req.member.name
    }
    try {
      const newBook = await Book.insert(book)
      const result = {
        result: 'A newly created post',
        author: book.author,
        title: book.title,
        genre: book.genre,
        description: book.description,
        evaluation: book.evaluation,
        member: book.member,
        id: newBook.id,
        links: [
          {
            href: process.env.URL + '/book-club/book-posts/{bookPostID}',
            rel: 'View a specific book post with GET or update or delete your own book-post with PUT, PATCH or DELETE.'
          }
        ]
      }
      this.notifySubscribers(result)
      res
        .status(201)
        .json(result)
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }

  /**
   * Updates a specific book post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    if (req.book.memberId === req.member.id) {
      try {
        await req.book.update({
          author: req.body.author,
          title: req.body.title,
          genre: req.body.genre,
          description: req.body.description,
          evaluation: req.body.evaluation,
          member: req.body.member
        })

        res
          .status(204)
          .end()
      } catch (error) {
        let err = error
        if (error.name === 'ValidationError') {
        // Create validation errors.
          err = createError(400)
          err.innerException = error
        }

        next(err)
      }
    } else {
      next(createError(403))
    }
  }

  /**
   * Updates part of a specific book-post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePart (req, res, next) {
    if (req.book.memberId === req.member.id) {
      try {
        await req.book.updatePart({
          author: req.body.author,
          title: req.body.title,
          genre: req.body.genre,
          description: req.body.description,
          evaluation: req.body.evaluation,
          member: req.body.member
        })
        res
          .status(204)
          .end()
      } catch (error) {
        let err = error
        if (error.name === 'ValidationError') {
          // Create validation errors.
          err = createError(400)
          err.innerException = error
        }
        next(err)
      }
    } else {
      next(createError(403))
    }
  }

  /**
   * Deletes a book post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    if (req.book.memberId === req.member.id) {
      try {
        await req.book.delete()
        res
          .status(204)
          .end()
      } catch (error) {
        next(error)
      }
    } else {
      next(createError(403))
    }
  }

  /**
   * Notifies subscribers.
   *
   * @param {object} result - The new book post.
   */
  async notifySubscribers (result) {
    const subscribers = await Webhook.getAll()
    for (let i = 0; i < subscribers.length; i++) {
      const response = await fetch(subscribers[i].url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': subscribers[i].token
        },
        body: JSON.stringify(result)
      })
      console.log(response.status)
    }
  }
}
