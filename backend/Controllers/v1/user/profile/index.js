const router = require("express").Router();

const changePassword = require('./change-password')
const edit = require('./edit')
const paymentMethods = require('./payment-methods')
const verify = require('./verify')
const upgrade = require('./upgrade')
const info = require('./info')

router.put('/change-password', changePassword)
router.put('/edit', edit)
router.use('/payment-methods', paymentMethods)
router.post('/verify', verify)
router.post('/upgrade', upgrade)
router.get('/info', info)

module.exports = router;