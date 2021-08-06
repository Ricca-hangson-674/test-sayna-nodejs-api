import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const verifyToken = asyncHandler( async (req, res, next) => {
    let token = req.params.token

    if (token) {
        try {

            console.log('Verify TOken', token)

            const decoded = await jwt.verify(token, process.env.JWT_TOKEN)
    
            console.log('VerifyToken', decoded)
    
            req.user = await User.findById(decoded.id)
    
            next()
        } catch (error) {
            /* if (error instanceof jwt.TokenExpiredError) {
                console.log('Expired 100')
            } */

            console.error("Error Custom", error.name, error.message, error.expiredAt)

            res.status(401)

            let message = ''

            switch (error.name) {
                case 'TokenExpiredError':
                    console.log('switch 1')
                    message = "Votre token n'ait plus valide, veuillez le reinitialiser"
                    break
                    
                case 'JsonWebTokenError':
                    console.log('switch 2')
                    message = "Le token envoyé n'est pas conforme"
                    break
            
                default:
                    console.log('switch 3')
                    message = "Le token envoyé n'existe pas"
                    break;
            }

            console.log('message', message)

            throw new Error(message)
        }
    } else {
        res.status(401)
        throw new Error("Le token est neccessaire")
    }
})


export default verifyToken