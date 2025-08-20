const router = require("express").Router();

const all = require("./all");
const details = require("./details");
const updateOrder = require("./update-order");

router.post('/all', all);
router.post('/details', details);
router.put('/update-order', updateOrder);

module.exports = router;