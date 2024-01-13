require('dotenv').config()
const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const auth = require('../middleware/auth')

router.post('/register', authCtrl.register)

router.post('/active', authCtrl.activeAccount)

router.post('/login', authCtrl.login)

router.post('/google_login', authCtrl.googleLogin)

router.post('/github_login', authCtrl.githubLogin)

router.get('/logout', auth, authCtrl.logout)

router.get('/refresh_token', authCtrl.generateAccessToken)

router.post('/forgotpassword', authCtrl.forgotPassword)

router.get('/passwordrecovery/:id/:token', authCtrl.verifyAccountRecoveryURL)

router.patch('/resetpassword', authCtrl.resetPassword)


module.exports = router