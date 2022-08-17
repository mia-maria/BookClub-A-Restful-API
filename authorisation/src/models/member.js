/**
 * Mongoose model Member based on example "Restful Tasks With JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'

const { isEmail } = validator

// Create a member schema.
const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User name required.'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, '{VALUE} is not a valid email address.']
  },
  password: {
    type: String,
    minlength: [10, 'The password must at least consist of 10 characters.'],
    maxlength: [1000],
    required: [true, 'A password is required.']
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

// The password is salted and hashed for increased security before it is saved.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

/**
 * Authenticates a member.
 *
 * @param {string} email - ...
 * @param {string} password - ...
 * @returns {Promise<Member>} ...
 */
schema.statics.authenticate = async function (email, password) {
  const member = await this.findOne({ email })

  // Throw an error if the member is not found or if the password is not correct.
  if (!member || !(await bcrypt.compare(password, member.password))) {
    throw new Error('Invalid member name or password.')
  }

  return member
}

/**
 * Gets a member by ID.
 *
 * @param {string} id - The member.id.
 * @returns {Promise<Member>} The Promise.
 */
schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

/**
 * Saves a new member.
 *
 * @param {object} memberData - ...
 * @param {string} memberData.email - ...
 * @param {string} memberData.password - ...
 * @returns {Promise<Member>} - ...
 */
schema.statics.insert = async function (memberData) {
  const member = new Member(memberData)
  return member.save()
}

// Make a model out of the schema.
export const Member = mongoose.model('Member', schema)
