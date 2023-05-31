const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const { OAuth2Client } = require("google-auth-library")

const client = new OAuth2Client(
    `${process.env.GOOGLE_CLIENT_ID}`,
    `${process.env.GOOGLE_CLIENT_SECRET}`,
    'postmessage',
)

const clientID = `${process.env.GITHUB_CLIENT_ID}`

const clientSecret = `${process.env.GITHUB_CLIENT_SECRET}`

const authCtrl = {
    register: async(req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: 'This user name already exists.'}) 
            
            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: 'This email already exists.'})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname, username: newUserName, email, password: passwordHash, gender
            })

            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000
            })
          
            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token, 
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async(req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({email})
            .populate("followers following", "avatar username fullname followers following")

            if(!user) return res.status(400).json({msg: "This email does not exists."})

           //if user exists
           loginUser(user, password, res)
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    googleLogin: async (req, res) => {
        try {
           
            const { tokens }  = await client.getToken(req.body.code); 
            
            const { id_token } = tokens

            if (id_token) {
                const verify = await client.verifyIdToken({
                    idToken: id_token , audience: `${process.env.GOOGLE_CLIENT_ID}`
                })
                
                const { email, email_verified, name, picture } = verify.getPayload()
                
                if(!email_verified) return res.status(400).json({msg: 'Email verification failed.'})
                
                const password = email + 'your google secret password'
                const passwordHash = await bcrypt.hash(password, 12)

                const user = await Users.findOne({email})

                if (user) {
                    loginUser(user, password, res)
                } else {
                    const user = {
                        fullname: name,
                        username: email.slice(0, -10), 
                        email, 
                        password: passwordHash,
                        avatar: picture, 
                        typeRegister: 'google'
                    }
                    registerUser(user, res)
                }
            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    githubLogin: async (req, res) => {
        try {
     
            const { code } = req.body;

            const URL = `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`
         
            const data = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify(code),
                headers: { 'accept': 'application/json' }
            })
            .then(res => res.json())
            .then(res => { return res })

            const { access_token } = data;

            if(!access_token) return res.status(400).json({msg: 'Github Authentication failed.'})

            
            const result = await fetch(`https://api.github.com/user`, {
                headers: {
                    'Authorization': `token ${access_token}`
                }
            })
            .then(res => res.json())
            .then(res => { return res })

            const { avatar_url, name, login } = result

            const newEmail = `${login.toLowerCase()}@github.com`

            const password = newEmail + 'your google secret password'

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({email: newEmail})

                if (user) {
                    loginUser(user, password, res)
                } else {
                    const user = {
                        fullname: name,
                        username: login, 
                        email: newEmail, 
                        password: passwordHash,
                        avatar: avatar_url, 
                        typeRegister: 'github'
                    }
                    registerUser(user, res)
                }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie('refreshtoken', {
                path: '/api/refresh_token'
            })
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    generateAccessToken: async(req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: 'Please login now.'})
            
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) return res.status(400).json({msg: 'Please login now.'})

                const user = await Users.findById(result.id).select("-password")
                .populate('followers following', 'avatar username fullname followers following')

                if(!user) return res.status(400).json({msg: 'This user does not exists.'})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}   

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

const loginUser = async (user, password, res) => {
   
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch) {
        let msgError = user.typeRegister === 'normal' ? 
        'Password is incorrect.' : 
        `Password is incorrect. This account login with ${user.typeRegister}`
       
        return res.status(400).json({msg: msgError})
    }

    const access_token = createAccessToken({id: user._id})
    const refresh_token = createRefreshToken({id: user._id}, res)

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30*24*60*60*1000 //30days
    })

    res.json({
        msg: 'Login Success!',
        access_token, 
        user: {
            ...user._doc,
            password: ''
        }
    })
}

const registerUser = async (user, res) => {
    
    const newUser = new Users(user)
    
    const access_token = createAccessToken({id: newUser._id})
    const refresh_token = createRefreshToken({id: newUser._id}, res)

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30*24*60*60*1000 //30days
    })

    await newUser.save()

    res.json({
        msg: 'Login Success!',
        access_token, 
        user: {
            ...newUser._doc,
            password: ''
        }
    })
}

module.exports = authCtrl