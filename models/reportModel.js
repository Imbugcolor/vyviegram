const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    post_id: {type: mongoose.Types.ObjectId, ref: 'post'},    
    user: {type: mongoose.Types.ObjectId, ref: 'user'},  
    text: String,
    status: {type: String, default: 'PENDING'},
    isRead: {type: Boolean, default: false}
}, {
    timestamps: true
})

module.exports = mongoose.model('report', reportSchema)
