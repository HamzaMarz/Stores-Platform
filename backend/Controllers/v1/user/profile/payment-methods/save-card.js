const { object, string } = require("yup");
const Payment = require("../../../../../Classes/Payment");
const {ERRORS} = require("../../../../utils/enums");

const schema = object({
	payment_method_id: string().min(5).max(200).required(),
});

module.exports = async (req, res, next) => {
	try {
		const isValid = await schema.isValid(req['body']);
		if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
		const { payment_method_id } = req['body'];
		const saved = await Payment.savePaymentMethod(req.user.id, payment_method_id);
		res.status(200).send({
			statusCode: 200,
			data: {
				id: saved.id,
				default: saved.default,
				brand: saved.card_brand,
				last4: saved.card_last4,
				exp_month: saved.card_exp_month,
				exp_year: saved.card_exp_year,
				created_at: saved.created_at,
				updated_at: saved.updated_at,
			},
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}



