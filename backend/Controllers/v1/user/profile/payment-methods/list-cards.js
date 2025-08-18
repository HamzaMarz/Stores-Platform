const Payment = require("../../../../../Classes/Payment");
const {ERRORS} = require("../../../../utils/enums");

module.exports = async (req, res, next) => {
	try {
		const cardsRaw = await Payment.listCards(req.user.id);
		const cards = cardsRaw.map(c => ({
			id: c.id,
			default: c.default,
			brand: c.card_brand,
			last4: c.card_last4,
			exp_month: c.card_exp_month,
			exp_year: c.card_exp_year,
			created_at: c.created_at,
			updated_at: c.updated_at,
		}));
		res.status(200).send({
			statusCode: 200,
			data: cards,
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}



