const router = require("express").Router();

const restrict = require("./restrict");
const details = require("./details");
const allSessions = require("./all-sessions");
const terminateSession = require("./terminate-session");
const terminateAllSessions = require("./terminate-all-sessions");
const allPaymentMethods = require("./all-payment-methods");
const allTransactions = require("./all-transactions");
const allPaymentTransactions = require("./all-payment-transactions");
const allSupport = require("./all-support");
const allRatings = require("./all-ratings");
const deleteRating = require("./delete-rating");
const allOrders = require("./all-orders");
const allUpgrade = require("./all-upgrade");
const upgrade = require("./upgrade");
const rejectUpgrade = require("./reject-upgrade");
const resetPassword = require("./reset-password");

router.put('/restrict', restrict);
router.post('/details', details);
router.post('/all-sessions', allSessions);
router.put('/terminate-session', terminateSession);
router.put('/terminate-all-sessions', terminateAllSessions);
router.post('/all-payment-methods', allPaymentMethods);
router.post('/all-transactions', allTransactions);
router.post('/all-payment-transactions', allPaymentTransactions);
router.post('/all-support', allSupport);
router.post('/all-ratings', allRatings);
router.put('/delete-rating', deleteRating);
router.post('/all-orders', allOrders);
router.post('/all-upgrade', allUpgrade);
router.put('/upgrade', upgrade);
router.put('/reject-upgrade', rejectUpgrade);
router.put('/reset-password', resetPassword);

module.exports = router;