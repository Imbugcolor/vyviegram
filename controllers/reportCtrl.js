const APIfeatures = require('../common/filterFeature')
const Reports = require('../models/reportModel')
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')

const reportCtrl = {
    createReport: async (req, res) => {
        try {
            const { text } = req.body

            const post = await Posts.findById(req.params.id)

            if(post.user.toString() === req.user._id.toString()) return res.status(400).json({ msg: 'Invalid Request.'})

            const isReported = await Reports.find({
                $and: [ { post_id: req.params.id }, {user: req.user._id} ]
            })

            if(isReported.length > 0) return res.status(400).json({ msg: 'You already reported this post.'})

            const report = new Reports({
                post_id: req.params.id, user: req.user._id, text
            })

            await report.save()

            return res.json({report})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getReports: async (req, res) => {
        try {

            const records = new APIfeatures(
                Reports.find(), 
                req.query
            )
            .filtering()
            .sorting()

            const totalRecords = await records.query

            const features = new APIfeatures(
                Reports.find(),
                req.query
            )
            .filtering()
            .sorting()
            .pagination()

            const reports = await features.query.populate('post_id', '_id content images user')

            return res.json({
                reports,
                result: reports.length,
                total: totalRecords.length,
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    executeReport: async (req, res) => {
        try {
            const { post_id } = req.body;

            const post = await Posts.findOneAndDelete({_id: post_id})
            await Comments.deleteMany({_id: {$in: post.comments}})

            await Reports.updateMany({ post_id }, {
                status: 'EXECUTED'
            })

            return res.json({
                msg: 'Execute success.', 
                newPost: {
                    ...post,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    rejectReport: async (req, res) => {
        try {
            const { id } = req.body;

            await Reports.findOneAndUpdate({ _id: id }, {
                status: 'REJECTED'
            })

            return res.json({msg: 'Rejected.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    readReports: async (req, res) => {
        try {
            await Reports.updateMany({ isRead: false }, {
                isRead: true
            })
            return res.json({msg: 'Success.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = reportCtrl