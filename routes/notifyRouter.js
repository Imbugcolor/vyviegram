const notifyCtrl = require('../controllers/notifyCtrl')
const auth = require('../middleware/auth')

const router = require('express').Router()

router.post('/notify', auth, notifyCtrl.createNotify)

router.delete('/notify/:id', auth, notifyCtrl.removeNotify)

router.get('/notifies', auth, notifyCtrl.getNotifies)

module.exports = router
