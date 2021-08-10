import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { validationResult } from 'express-validator'
import {
    generateToken,
    generateRefreshToken
} from '../utils/generateToken.js'
import RefreshToken from '../models/refreshTokenModel.js'


/***********************************************************************************
 *
 * ROUTES PUBLIC
 *
 */

/**
 * @desc    Login
 * @route   POST /login
 * @access  Public
 *
 * @type {express.RequestHandler}
 */
const login = asyncHandler(async (req, res) => {

	const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
	  
	  res.status(401)
	  throw new Error("L'email/password est manquant")
    }

	const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {

		const token = generateToken(user._id)

		/** Store Token */
		user.token = token
		await user.save()

        res.json({
			error: false,
			message: "L'utilisateur a été authentifié succès",
			tokens: {
				token: token,
				refreshToken: await generateRefreshToken(user._id),
				createdAt: Date.now()
			}
        })
    } else {
        res.status(401)
        throw new Error("Votre email/password est erroné")
    }
})

/**
 * @desc    Register
 * @route   POST /register
 * @access  Public
 *
 * @type {express.RequestHandler}
 */
const register = asyncHandler(async (req, res) => {
	const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });

	  // console.log('express-validator')
	  
	  res.status(401)
	  throw new Error("L'un des donnees obligatoires ne sont pas conformes")
    }

	const { 
		firstname, 
		lastname, 
		date_naissance,
		sexe,
		email, 
		password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(401)
        throw new Error("Votre email est deja utlisé")
    }

	const body = { 
		firstname, 
		lastname, 
		date_naissance,
		sexe,
		email, 
		password }

	if (Object.values(body).length === 6) {
		if (Object.values(body).some(b => b === undefined)) {
			res.status(401)
			throw new Error("L'une ou plusieurs des donnees obligatoire sont manquantes")
		}
	}

    const user = await User.create({
        firstname, 
		lastname, 
		date_naissance,
		sexe,
		email, 
		password
    })

    if (user) {
        res.status(201).json({
			error: false,
			message: "L'utilisateur a bien été créé avec succès",
			tokens: {
				token: generateToken(user._id),
				refreshToken: await generateRefreshToken(user._id),
				createdAt: Date.now()
			}
        })
    } else {
        res.status(401)
        throw new Error("L'une ou plusieurs des donnees obligatoire sont manquantes")
    }

	// L'un des donnees obligatoires ne sont pas conformes
})


/***********************************************************************************
 *
 * ROUTES PROTECTED
 *
 */

/**
 * @desc    Get an user
 * @route   GET /user/{token}
 * @access  Protected
 *
 * @type {express.RequestHandler}
 */
const getUser = asyncHandler(async (req, res) => {

	if (req.user) {
        res.json({
			error: false,
			user: {
				firstname: req.user.firstname,
				lastname : req.user.lastname,
				email : req.user.email,
				date_naissance: req.user.date_naissance,
				sexe: req.user.sexe,
				createdAt: req.user.createdAt
			}
        })
    } else {
        res.status(404)
        throw new Error("L'une ou plusieurs des donnees obligatoire sont manquantes")
    }
})


/**
 * @desc    Update an user
 * @route   PUT /user/{token}
 * @access  Protected
 *
 * @type {express.RequestHandler}
 */
const updateUser = asyncHandler(async (req, res) => {

	const {
		firstname,
		lastname,
		sexe,
		date_naissance
	} = req.body

	const body = {
		firstname,
		lastname,
		sexe,
		date_naissance
	}

	//console.log("body", body, Object.values(body), Object.values(body).length)

	if (Object.values(body).length > 0) {
		if (Object.values(body).every(b => b === undefined)) {
			res.status(401)
			throw new Error("Aucun données n'a été envoyée")
		}
	}

	const user = await User.findById(req.user._id)

    if (user) {
        user.firstname 		= firstname || user.firstname
        user.lastname 		= lastname || user.lastname
        user.sexe           = sexe || user.sexe
        user.date_naissance = date_naissance || user.date_naissance

        /* if (req.body.password) {
            user.password = req.body.password
        } */

        const updatedUser = await user.save()

        res.json({
            error: false,
			message: "L'utilisateur a été modifié succès"
        })
    } else {
        res.status(404)
        throw new Error("L'utilisateur n'a pas trouvé")
    }
})


/**
 * @desc    Logout an user
 * @route   DELETE /user/{token}
 * @access  Protected
 *
 * @type {express.RequestHandler}
 */
const logout = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	const refreshToken = await RefreshToken.findOne({user: req.user._id}).sort({created: '-1'})

	// console.log('RefreshToken', refreshToken)
	// console.log('User', user, req.user)

	if (user) {
		/** Delete Token */
		user.token = null
		await user.save()
	
        res.json({ 
			error: false,
			message: "L'utilisateur a été deconnecte success"
		})
    } else {
        res.status(404)
        throw new Error("L'utilisateur n'a pas été trouvé")
    }
})

/**
 * @desc    Fetch all users
 * @route   GET /users
 * @access  Protected
 *
 * @type {express.RequestHandler}
 */
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})

    res.json({ 
		error: false,
		users: users
	})
})

export {
	login,
	register,
	getUser,
	updateUser,
	logout,
	getUsers
}