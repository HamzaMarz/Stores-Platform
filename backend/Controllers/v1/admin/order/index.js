const router = require("express").Router();

const search = require("./search");
const updateStatus = require("./update-status");
const refund = require("./refund");
const allPending = require("./all-pending");
const rejectRefund = require("./reject-refund");

router.post('/search', search);
router.put('/update-status', updateStatus);
router.put('/refund', refund);
router.post('/all-pending', allPending);
router.put('/reject-refund', rejectRefund);

module.exports = router; 