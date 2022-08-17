/**
 * Mongoose model Webhook.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import validator from 'validator'

const { isURL } = validator

// Create a webhook schema.
const schema = new mongoose.Schema({
  member: {
    type: String,
    required: [true, 'Member-id is required.'],
    unique: true
  },
  url: {
    type: String,
    required: [true, 'Url is required.'],
    unique: true,
    validate: [isURL, '{VALUE} is not a valid url.']
  },
  token: {
    type: String,
    minlength: [20, 'The token must at least consist of 20 characters.'],
    maxlength: [1000],
    required: [true, 'A token is required.']
  }
}, {
  timestamps: true
})

/**
 * Saves a new webhook.
 *
 * @param {object} webhookData - ...
 * @param {string} webhookData.member - ...
 * @param {string} webhookData.url - ...
 * @param {string} webhookData.token - ...
 * @returns {Promise<Webhook>} - ...
 */
schema.statics.insert = async function (webhookData) {
  const webhook = new Webhook(webhookData)
  return webhook.save()
}

/**
 * Gets all webhook-subscribers.
 *
 * @returns {Promise<Webhook[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

// Make a model out of the schema.
export const Webhook = mongoose.model('Webhook', schema)
