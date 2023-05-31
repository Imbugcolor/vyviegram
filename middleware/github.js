require('dotenv').config()
const passport = require('passport');
const { Strategy } = require('passport-github2')
const Users = require('../models/userModel')

const githubLogin = async(profile) => {
    const { _json } = profile
    // console.log(_json)
}

passport.use('auth-github', 
    new Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/github/callback'
    }, function(accessToken, refreshToken, profile, done) {
        githubLogin(profile)
        done(null, profile)
    })
)