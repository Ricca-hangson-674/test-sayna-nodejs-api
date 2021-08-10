import asyncHandler from 'express-async-handler'

const existToken = asyncHandler( async (req, res, next) => {
    let token = req.user.token

    console.log('Exist Token', req.user, token)

    if (token) {

        next()

    } else {
        res.status(401)
        throw new Error("Le token est neccessaire")
    }
})

export default existToken