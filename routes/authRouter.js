require('dotenv').config()
const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const auth = require('../middleware/auth')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/google_login', authCtrl.googleLogin)

router.post('/github_login', authCtrl.githubLogin)

router.get('/logout', auth, authCtrl.logout)

router.get('/refresh_token', authCtrl.generateAccessToken)


module.exports = router