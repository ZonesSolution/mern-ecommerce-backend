const express = require('express')
const router = express.Router()
const {registerController, loginController, forgetPasswordLink, resetPassword} = require('../controllers/authController')
const { verifyToken, isAdmin } = require('../middlewares/auth')

//register route
router.post('/register', registerController)
//login route
router.post('/login', loginController)
//forget pass
router.post('/forgot-password', forgetPasswordLink)
//reset password
router.post('/reset-password/:id/:token', resetPassword)
//user private route
router.get('/auth-check', verifyToken, (req, res) => {
    res.status(200).send({ok : true})
})
//admin private route
router.get('/admin-check', verifyToken, isAdmin, (req, res) => {
    res.status(200).send({ok : true})
})

module.exports = router