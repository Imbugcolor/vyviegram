const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query; //query mongoose
        this.queryString = queryString //query params (req.params)
    }

    // pagination
    paginating() {
        const page = this.queryString.page * 1 || 1 // if not exist req.query.page default page = 1
        const limit = this.queryString.limit * 1 || 9 // if not exist req.query.limit default limit 9 posts on page
        const skip = (page - 1) * limit //skip (page - 1)*limit document 
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const { sender, recipient, text, media, call, share } = req.body

            if(!recipient || (!text.trim() && media.length === 0 && !call && !share)) return;

            // update newest text, media, call in conversation collection, if conversation not exist => create new with upsert property
            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [sender, recipient]},
                    {recipients: [recipient, sender]}
                ]
            },{
                recipients: [sender, recipient],
                sender, text, media, call, share, deleted: [], isRead: false
            }, { new: true, upsert: true })

            // create new message
            const newMessage = new Messages({
                conversation: newConversation._id,
                sender,
                call,
                recipient,
                text,
                media,
                share
            })

            await newMessage.save()

            res.json({
                msg: 'Create Success!', 
                newMsg: newMessage
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id, deleted: { $nin: [req.user._id] }
            }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar username fullname')

            res.json({
                conversations,
                result: conversations.length
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    {sender: req.user._id, recipient: req.params.id, deleted: { $nin: [req.user._id] }},
                    {sender: req.params.id, recipient: req.user._id, deleted: { $nin: [req.user._id] }}
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')
            
            res.json({
                messages,
                result: messages.length
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({_id: req.params.id, sender: req.user._id})
            res.json({msg: 'Deleted'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [req.user._id, req.params.id]},
                    {recipients: [req.params.id, req.user._id]}
                ]
            },{
                $push: { deleted: req.user._id }
            })

            await Messages.updateMany({conversation: newConver._id}, { 
                $push: { deleted: req.user._id }
            })

            res.json({msg: 'Delete Success.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    readMessage: async (req, res) => {
        try {
            await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [req.user._id, req.params.id]},
                    {recipients: [req.params.id, req.user._id]}
                ]
            },{
                isRead: true
            })

            res.json({msg: 'Success.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = messageCtrl;