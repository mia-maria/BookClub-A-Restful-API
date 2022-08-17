/**
 * Mongoose configuration based on example "Restful Tasks" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

/**
 * Connects to a MongoDB database.
 *
 * @returns {Promise} If there is a successful connection it will resolve to this.
 */
export const connectDB = async () => {
  // Get notifications by binding connection to events.
  mongoose.connection.on('connected', () => console.log('The mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`A mongoose connection error has occurred: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('The mongoose connection is disconnected.'))

  // The Mongoose connection will close if the Node process ends.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  console.log('Establishing a Mongoose connection')
  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
