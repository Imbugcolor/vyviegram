require('dotenv').config()
const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')
const passport = require('passport')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/google_login', authCtrl.googleLogin)

router.get('/github', 
passport.authenticate('auth-github', {
        scope: ['user:email'],
        session: false
    })
)

router.get('/github/callback',  
    passport.authenticate('auth-github', {
        scope: ['user:email'],
        session: false,
        // successRedirect: process.env.CLIENT_URL,
        // failureRedirect: `${process.env.CLIENT_URL}/login`
    }),
    authCtrl.githubAuth
)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)


module.exports = router