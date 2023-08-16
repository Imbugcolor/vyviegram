const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')

const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if(!token) return res.status(403).json({msg: 'Invalid Authentication.'})

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decode) return res.status(403).json({msg: 'Invalid Authentication.'})

        const user = await Users.findOne({_id: decode.id})
        
        if(user.role !== 'admin')
        return res.status(403).json({msg: 'Access Denied.'})

        req.user = user
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message })
    }
}

module.exports = authAdmin