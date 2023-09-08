const reportCtrl = require('../controllers/reportCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

const router = require('express').Router()

router.post('/report/post/:id', auth, reportCtrl.createReport)

router.get('/reports', authAdmin, reportCtrl.getReports)

router.patch('/report/execute', authAdmin, reportCtrl.executeReport)

router.patch('/report/reject', authAdmin, reportCtrl.rejectReport)

router.patch('/reports/read', authAdmin, reportCtrl.readReports)

module.exports = router;