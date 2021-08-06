import path from 'path'
import express  from 'express'
import dotenv   from 'dotenv'
import colors   from 'colors'
import morgan from 'morgan'

import connectDB from "./src/config/db.js"
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js"

import userRoutes from "./src/routes/userRoute.js"

/** ENV */
dotenv.config()

/** Initialize MongoDB */
connectDB()

/** Initialize app express */
const app = express()

/** Configuration */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

/** Parse body request */
app.use(express.json())


/** Routes */
app.use('/', userRoutes)

const __dirname = path.resolve()

/** Configuration deployment */
app.use(express.static(path.join(__dirname, '/template')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'template', 'index.html'))
})


/** Exception */
app.use(notFound)
app.use(errorHandler)


/** Start Server */
const PORT = process.env.PORT || 5000

app.listen(
	PORT, 
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold))