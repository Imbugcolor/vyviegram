const Reports = require('../models/reportModel')

const reportCtrl = {
    createReport: async (req, res) => {
        try {
            const { post_id, text } = req.body

            const report = new Reports({
                post_id, user: req.user._id, text
            })

            await report.save()

            return res.json({report})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = reportCtrl