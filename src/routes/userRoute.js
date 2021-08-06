import express from 'express'
import {
	getUsers,
	login,
	register,
	getUser,
	updateUser,
	logout,
}from '../controllers/userController.js'
import apiLimiter  from '../middleware/rateLimitMiddleware.js'
import verifyToken  from '../middleware/verifyTokenMiddleware.js'

import { schemaLoginRequest, schemaRegisterRequest } from '../middleware/validationMiddleware.js'

const router = express.Router()


/***********************************************************************************
 *
 * ROUTES PUBLIC
 *
 */
router.post('/login', schemaLoginRequest, apiLimiter, login)
router.post('/register', schemaRegisterRequest, register)

/***********************************************************************************
 *
 * ROUTES PROTECTED
 *
 */
router.get('/users/:token', verifyToken, getUsers)
router.put('/user/:token', verifyToken, updateUser)
router.delete('/user/:token', verifyToken, logout)
router.get('/user/:token', verifyToken, getUser)


export default router