const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    sender: mongoose.Types.ObjectId,
    text: String,
    media: Array,
    call: Object,
    share: Object,
    isRead: { type: Boolean, default: false },
    deleted: Array,
}, {
    timestamps: true
})

module.exports = mongoose.model('conversation', conversationSchema)