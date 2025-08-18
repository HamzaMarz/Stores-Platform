const router = require("express").Router();

const verified = require("../../../../Middlewares/verified-user");

const createPayment = require("./create-payment");
const getPaymentStatus = require("./get-payment-status");

router.post('/create-payment', verified, createPayment);
router.post('/get-payment-status', verified, getPaymentStatus);

module.exports = router;



