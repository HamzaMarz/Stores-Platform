const router = require("express").Router();

const authMiddleware = require("../../../Middlewares/user-auth");
const sellerMiddleware = require("../../../Middlewares/seller-auth");

const auth = require("./auth");
const cart = require("./cart");
const profile = require("./profile");
const seller = require("./seller");
const order = require("./order");
const chat = require("./chat");
const support = require("./support");
const payment = require("./payment");
const verifiedMiddleware = require("../../../Middlewares/verified-user");

router.use('/auth', auth);
router.use('/cart', authMiddleware ,cart);
router.use('/profile', authMiddleware ,profile);
router.use('/seller', authMiddleware , sellerMiddleware ,seller);
router.use('/order', authMiddleware ,order);
router.use('/chat', authMiddleware ,chat);
router.use('/support', authMiddleware ,support);
router.use('/payment', authMiddleware, verifiedMiddleware, payment);


module.exports = router;