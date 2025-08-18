const router = require("express").Router();

const admin = require("./admin");
const product = require("./product");
const user = require("./user");
const stripe = require("./stripe");

router.use('/admin', admin);
router.use('/product', product);
router.use('/user', user);
router.use('/stripe', stripe);

module.exports = router;