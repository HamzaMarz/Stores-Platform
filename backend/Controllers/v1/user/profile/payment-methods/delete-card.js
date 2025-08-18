const { object, number } = require("yup");
const Payment = require("../../../../../Classes/Payment");
const {ERRORS} = require("../../../../utils/enums");

const schema = object({
	id: number().min(1).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
	try {
		const isValid = await schema.isValid(req['query']);
		if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
		const { id } = req['query'];
		await Payment.deleteCard(req.user.id, id);
		res.status(200).send({
			statusCode: 200,
			message: 'success'
		});
	} catch (e) {
		next(e);
	}
}



