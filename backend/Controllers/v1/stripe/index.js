const router = require("express").Router();

const webhook = require("./webhook");

router.post('/webhook', webhook);

module.exports = router;


