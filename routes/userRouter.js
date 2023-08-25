const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const userCtrl = require('../controllers/userCtrl')

router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)

router.patch('/user', auth, userCtrl.updateUser)

router.patch('/user/:id/follow', auth, userCtrl.follow)

router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)

router.get('/users', authAdmin, userCtrl.getAllUsers)

router.get('/recent-users', authAdmin, userCtrl.getRecentUsers)

router.patch('/update-roles/:id', authAdmin, userCtrl.updateRoles)

module.exports = router