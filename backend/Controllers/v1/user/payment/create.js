const { object, number } = require("yup");
const Transaction = require("../../../../Classes/Transaction");
const {ERRORS} = require("../../../utils/enums");

const schema = object({
	order_id: number().min(1).max(1000000000).required(),
	user_payment_id: number().min(1).max(1000000000)
});

module.exports = async (req, res, next) => {
	try {
		const isValid = await schema.isValid(req['body']);
		if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
		const { order_id, user_payment_id } = req['body'];
		const { client_secret, transaction } = await Transaction.createPayment(req.user.id, order_id, user_payment_id);
		res.status(200).send({
			statusCode: 200,
			data: { client_secret, transaction_id: transaction.id, status: transaction.status },
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}


