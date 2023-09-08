const APIfeatures = require('../common/filterFeature')
const Users = require('../models/userModel')
const moment = require('moment')

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({ username: {$regex: req.query.username} })
            .limit(10).select('fullname username avatar role')

            res.json({users})

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            .populate('followers following', '-password')
            if(!user) return res.status(400).json({msg: 'User does not exists.'})

            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, story, website, gender } = req.body
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender
            })

            res.json({msg: 'Update Success!'})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: 'You has followed this user.'})

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, {
                $push: { followers: req.user._id }
            }, {new: true}).populate('followers following', '-password')

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: { following: req.params.id }
            }, {new: true})

            res.json({newUser})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, {
                $pull: { followers: req.user._id }
            }, {new: true}).populate('followers following', '-password')

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: { following: req.params.id }
            }, {new: true})

            res.json({newUser})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const sugesstions = []

            const userMap = await Users.find({_id: { $in: req.user.following }})

            userMap.map(user => {
                user.following.map(follow => {
                    sugesstions.push(follow)
                })
            })

            const num = req.query.num || 10

            const users = await Users.aggregate([
                { 
                    $match: { 
                        $and: [
                            {_id: {$nin: newArr}},
                            {_id: {$in: sugesstions}}
                        ]
                    }
                },
                { $sample: { size: Number(num) }},
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers'}},
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following'}}
            ]).project('-password')
            
            return res.json({
                users,
                result: users.length
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const records = new APIfeatures(
                Users.find(), 
                req.query
            )
            .filtering()
            .sorting()

            const totalRecords = await records.query

            const features = new APIfeatures(
                Users.find().select('-password'),
                req.query
            )
            .filtering()
            .sorting()
            .pagination()

            const users = await features.query

            return res.json({
                users,
                result: users.length,
                total: totalRecords.length,
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getRecentUsers: async (req, res) => {
        try {
            const records = new APIfeatures(
                Users.find({ 
                    role: 'user', 
                    createdAt: {
                        $gte: moment().add(-10, "days"),
                    }
                }), 
                req.query
            )
            .filtering()
            .sorting()

            const totalRecords = await records.query

            const features = new APIfeatures(
                Users.find({ 
                    role: 'user', 
                    createdAt: {
                        $gte: moment().add(-10, "days"),
                    }
                }).select('-password'),
                req.query
            )
            .filtering()
            .sorting()
            .pagination()
          
            const recentUsers = await features.query

            return res.json({
                recentUsers,
                result: recentUsers.length,
                total: totalRecords.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateRoles: async (req, res) => {
        try {
            const { role } = req.body;

            if(role !== 'admin' && role !== 'user') {
                return res.status(400).json({msg: 'Request is not valid'})
            }

            await Users.findByIdAndUpdate(req.params.id, {
                role
            })

            return res.json('Updated.')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = userCtrl