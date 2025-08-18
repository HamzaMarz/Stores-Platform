const router = require("express").Router();

const ensureCustomer = require("./ensure-customer");
const addCard = require("./add-card");
const saveCard = require("./save-card");
const listCards = require("./list-cards");
const deleteCard = require("./delete-card");

router.post('/ensure', ensureCustomer);
router.post('/add', addCard);
router.post('/save', saveCard);
router.get('/list', listCards);
router.delete('/delete', deleteCard);

module.exports = router;



