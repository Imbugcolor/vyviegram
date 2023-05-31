require('dotenv').config()
const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/google_login', authCtrl.googleLogin)

router.post('/github_login', authCtrl.githubLogin)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)


module.exports = router