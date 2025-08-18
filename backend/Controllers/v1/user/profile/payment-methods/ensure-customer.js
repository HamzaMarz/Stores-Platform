const Payment = require("../../../../../Classes/Payment");
const {ERRORS} = require("../../../../utils/enums");

module.exports = async (req, res, next) => {
	try {
		const user_id = req.user.id;
		await Payment.ensureStripeCustomer(user_id);
		res.status(200).send({
			statusCode: 200,
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}


