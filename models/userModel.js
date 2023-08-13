const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        require: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true   
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dnv2v2tiz/image/upload/v1679802559/instagram-avt-profile/unknow_fc0uaf.jpg'
    },
    role: {
        type: String,
        default: 'user'
    },
    gender: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: '',
    },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    website: {
        type: String,
        default: ''
    },
    followers: [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'user'
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'user'
        }
    ],
    saved: [{type: mongoose.Types.ObjectId, ref: 'post'}],
    typeRegister: {
        type: 'String',
        default: 'normal' // github, google
    },
    rf_token: { type: 'String' }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)