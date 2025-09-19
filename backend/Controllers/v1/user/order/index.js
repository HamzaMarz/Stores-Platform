const router = require("express").Router();

const all = require("./all");
const details = require("./details");
const cancel = require("./cancel");
const confirmDelivery = require("./confirm-delivery");

router.post('/all', all);
router.post('/details', details);
router.post('/confirm-delivery', confirmDelivery);
router.put('/cancel', cancel);

module.exports = router; 