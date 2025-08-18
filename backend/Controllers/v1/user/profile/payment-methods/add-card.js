const Payment = require("../../../../../Classes/Payment");
const {ERRORS} = require("../../../../utils/enums");

module.exports = async (req, res, next) => {
	try {
		const result = await Payment.createAddCardIntent(req.user.id);
		res.status(200).send({
			statusCode: 200,
			data: result,
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}



