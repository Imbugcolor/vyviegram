const Comments = require('../models/commentModel')
const Posts = require('../models/postModel')
const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postId, content, tag, reply, postUserId } = req.body

            const newComment = new Comments({
                user: req.user._id, content, tag, reply, postUserId, postId
            })

            await Posts.findOneAndUpdate({_id: postId}, {
                $push: { comments: newComment._id }
            }, { new: true })

            await newComment.save()

            res.json({newComment})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body

            const cm = await Comments.findOneAndUpdate({_id: req.params.id, user: req.user._id}, {
                content
            })
            
            if(!cm) return res.status(400).json({msg: 'Something Wrong!'})

            res.json({msg: 'Update Success.'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    likeComment: async (req, res) => {
        try {

            const comment = await Comments.find({_id: req.params.id, likes: req.user._id})
            if(comment.length > 0) return res.status(400).json({msg: 'You liked this post.'})

            await Comments.findOneAndUpdate({_id: req.params.id}, {
                $push: { likes: req.user._id }
            }, { new: true })
            
            res.json({ msg: 'Liked.' })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikeComment: async (req, res) => {
        try {
           
            await Comments.findOneAndUpdate({_id: req.params.id}, {
                $pull: { likes: req.user._id }
            }, { new: true })

            res.json({msg: 'Unliked.'})

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteComment: async (req, res) => {
        try {
            // Delete comment of comment model
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {user: req.user._id},
                    {postUserId: req.user_id}
                ]
            })

            // Delete comment in comments field of post model
            await Posts.findOneAndUpdate({_id: comment.postId}, {
                $pull: { comments: req.params.id }
            })

            res.json({msg: 'Deleted Comment.'})
        } catch (err) {
            return res.status(500).json({ msg: err.message })          
        }
    }
}

module.exports = commentCtrl