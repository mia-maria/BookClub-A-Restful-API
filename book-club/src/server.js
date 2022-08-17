/**
 * The starting point of the book-club-application.
 * Based on example "Restful Tasks With JWT" in 1DV026 by Mats Loock.
 *
 * @author Mia-Maria Galistel <mg223tj@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import { router } from './routes/router.js'
import { connectDB } from './configuration/mongoose.js'

/**
 * The main function. Connects to MongoDB, creates an Express app and starts a server.
 */
const main = async () => {
  await connectDB()

  const app = express()

  // Increase security by using various HTTP headers.
  app.use(helmet())

  // Enable cors requests.
  app.use(cors())

  // HTTP requests are logged.
  app.use(logger('dev'))

  // Requests which include application/json are parsed.
  app.use(express.json())

  // Add routes.
  app.use('/', router)

  // Manage errors.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
      return
    }

    // Detailed error is only provided in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        innerException: err.innerException,
        stack: err.stack
      })
  })

  // Use the HTTP server to listen for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C in order to terminate...')
  })
}

main().catch(console.error)
