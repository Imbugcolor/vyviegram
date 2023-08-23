const Users = require('../models/userModel')
const moment = require('moment')


class APIfeatures {
    query;
    queryString;

    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['page', 'sort', 'limit', 'sizes']
        excludedFields.forEach(el => delete(queryObj[el]))

        // console.log({after: queryObj}) //after delete params

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // lte, gte = less/greater than or equal
        // lt, gt = less/greater than
        // regex = compare ~ string 
        // console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        
        return this;
    }
    pagination(){
        let page = Number(this.queryString.page) * 1 || 1;
        let limit = Number(this.queryString.limit) * 1 || 4;
        let skip = (page -1) * limit;

        this.query = this.query.limit(limit).skip(skip);

        return this;
    }
}

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
            const users = await Users.find({ role: 'user' })

            return res.json({
                users,
                total: users.length
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
    }
}

module.exports = userCtrl