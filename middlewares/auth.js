const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

//middleware for authentication
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token) return res.status(401)
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401)
            req.user = decoded
            next()
        })
    } catch (error) {
        console.log(error)
    }
}

//protected route middleware
const isAdmin = async (req, res, next) => {
    try {
        const _id = req.user._id
        const user = await userModel.findOne({ _id })
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { verifyToken, isAdmin }