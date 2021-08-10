import rateLimit from "express-rate-limit"
import asyncHandler from 'express-async-handler'

const convertirMillisecondToMinute = (value) => {
    return Math.floor(value / (60 * 1000))
}

const convertirToMillisecond = (value) => {
    return value * 60 * 1000
}

const max = process.env.NOMBRE_TENTATIVE

const limit = process.env.INTERVALLE_TENTATIVE

const apiLimiter = rateLimit({
    // max: max,
    // windowMs: limit * 60 * 1000,
    // max: Number(process.env.NOMBRE_TENTATIVE),
    // windowMs: Number(process.env.INTERVALLE_TENTATIVE),
    max: 5,
    windowMs: 60 * 60 * 1000, // 1heure
    handler: (req, res, /*next*/) => {
        console.log("Rating ", process.env.INTERVALLE_TENTATIVE, process.env.NOMBRE_TENTATIVE)
        res.status(401).send({
            error: true,
            message: `Trop de tentative sur l'email ${req.body.email}.` + 
                    ` Veuillez patientez 1h`
        })
    }
})

export default apiLimiter