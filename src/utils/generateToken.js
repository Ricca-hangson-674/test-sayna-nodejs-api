import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '../models/refreshTokenModel.js'

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

const generateToken = (id) => {

    // console.log('generateToken', process.env.JWT_EXPIRATION)

    return jwt.sign({ 
        id,
        createdAt: new Date().getTime()
    }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}

const generateRefreshToken = async (user) => {
    // create a refresh token that expires in 7 days
    const token = randomTokenString()
    
    const refresh = await RefreshToken.create({
        user: user.id,
        token,
        expires: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRATION * 1000)
    })
    
    // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    return token
}

export {
    generateToken,
    generateRefreshToken
}
