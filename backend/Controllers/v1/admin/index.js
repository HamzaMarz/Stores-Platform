const router = require("express").Router();

const adminAuth = require("../../../Middlewares/admin-auth");

const auth = require("./auth");
const support = require("./support");
const order = require("./order");
const user = require("./user");

router.use('/auth', auth);
router.use('/support', adminAuth, support);
router.use('/order', adminAuth, order);
router.use('/user', adminAuth, user);

module.exports = router;