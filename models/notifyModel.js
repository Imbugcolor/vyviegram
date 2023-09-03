const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    recipients: [mongoose.Types.ObjectId],
    url: String,
    text: String,
    content: String,
    description: String,
    image: String,
    isRead: Array
}, {
    timestamps: true
})

module.exports = mongoose.model('notify', notifySchema)
