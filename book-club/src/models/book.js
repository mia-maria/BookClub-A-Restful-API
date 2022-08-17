/**
 * Mongoose model Book based on example "Restful Tasks with JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a book schema.
const schema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  evaluation: {
    type: String,
    trim: true
  },
  memberId: {
    type: String,
    trim: true
  },
  member: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    /**
     * Remove sensitive information by transforming the resulting object.
     *
     * @param {object} doc - The mongoose document which will be converted.
     * @param {object} ret - The converted object representation.
     */
    transform: function (doc, ret) {
      delete ret._id
    },
    // Virtual fields are serialized.
    virtuals: true
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

/**
 * Inserts a new book.
 *
 * @param {object} bookData - ...
 * @param {string} bookData.author - ...
 * @param {string} bookData.title - ...
 * @param {string} bookData.genre - ...
 * @param {string} bookData.description - ...
 * @param {string} bookData.evaluation - ...
 * @param {string} bookData.member - ...
 * @returns {Promise<Book>} The Promise to be fulfilled.
 */
schema.statics.insert = async function (bookData) {
  const book = new Book(bookData)
  return book.save()
}

/**
 * Gets a book by book.id.
 *
 * @param {string} id - The book.id.
 * @returns {Promise<Book>} The Promise to be fulfilled.
 */
schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

/**
 * Gets all books.
 *
 * @returns {Promise<Book[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Updates a book.
 *
 * @param {object} bookData - ...
 * @param {string} bookData.author - ...
 * @param {string} bookData.title - ...
 * @param {string} bookData.genre - ...
 * @param {string} bookData.description - ...
 * @param {string} bookData.evaluation - ...
 * @returns {Promise<Book>} The Promise to be fulfilled.
 */
schema.methods.update = async function (bookData) {
  if (bookData.author?.localeCompare(this.author) !== 0) {
    this.author = bookData.author
  }
  if (bookData.title?.localeCompare(this.title) !== 0) {
    this.title = bookData.title
  }
  if (bookData.genre?.localeCompare(this.genre) !== 0) {
    this.genre = bookData.genre
  }
  if (bookData.description?.localeCompare(this.description) !== 0) {
    this.description = bookData.description
  }
  if (bookData.evaluation?.localeCompare(this.evaluation) !== 0) {
    this.evaluation = bookData.evaluation
  }

  return this.save()
}

/**
 * Updates part of a book.
 *
 * @param {object} bookData - ...
 * @param {string} bookData.author - ...
 * @param {string} bookData.title - ...
 * @param {string} bookData.genre - ...
 * @param {string} bookData.description - ...
 * @param {string} bookData.evaluation - ...
 * @returns {Promise<Book>} The Promise to be fulfilled.
 */
schema.methods.updatePart = async function (bookData) {
  if (bookData.author) {
    this.author = bookData.author
  }
  if (bookData.title) {
    this.title = bookData.title
  }
  if (bookData.genre) {
    this.genre = bookData.genre
  }
  if (bookData.description) {
    this.description = bookData.description
  }
  if (bookData.evaluation) {
    this.evaluation = bookData.evaluation
  }

  return this.save()
}

/**
 * Deletes a book.
 *
 * @returns {Promise} The Promise to be fulfilled.
 */
schema.methods.delete = async function () {
  return this.remove()
}

// Create a model with the Book-schema.
export const Book = mongoose.model('Book', schema)
