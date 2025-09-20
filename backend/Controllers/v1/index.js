const router = require("express").Router();

const admin = require("./admin");
const product = require("./product");
const user = require("./user");
const stripe = require("./stripe");
const deploy = require("./deploy");

router.use('/admin', admin);
router.use('/product', product);
router.use('/user', user);
router.use('/stripe', stripe);
router.use('/deploy', deploy);

module.exports = router;