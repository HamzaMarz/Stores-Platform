const { object, string, number } = require("yup");
const Operation = require("../../../../Classes/Operation");
const Payment = require("../../../../Classes/Payment");
const {ERRORS, OPERATION_STATUS, OPERATION_NAME} = require("../../../utils/enums");

// step: 'start' | 'check-otp' | 'start-add-card' | 'save-card'
const schema = object({
    step: string().oneOf(['start', 'check-otp', 'start-add-card', 'save-card']).required(),
    email: string().email().min(3).max(50),
    otp: string().min(4).max(6),
    payment_method_id: string().min(5).max(200),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { step, email, otp, payment_method_id } = req['body'];
        const user_id = req.user.id;

        let data = null;
        if (step === 'start') {
            try {
                const created_at = await Operation.startVerifyEmail(user_id, email || req.user.email);
                data = { created_at };
            } catch (err) {
                if (err && err.message === ERRORS.OPERATION_IN_PROGRESS) {
                    const existing = await Operation.getOperationByName(user_id, OPERATION_NAME.VERIFY_EMAIL);
                    data = { created_at: existing?.created_at };
                } else {
                    throw err;
                }
            }
        } else if (step === 'check-otp') {
            await Operation.checkVerifyEmailOTP(user_id, otp);
        } else if (step === 'start-add-card') {
            const intent = await Payment.createAddCardIntent(user_id);
            data = { client_secret: intent.client_secret };
        } else if (step === 'save-card') {
            const saved = await Payment.savePaymentMethod(user_id, payment_method_id);
            await Operation.completeVerifyEmail(user_id);
            data = { verified: true, card: {
                id: saved.id,
                default: saved.default,
                brand: saved.card_brand,
                last4: saved.card_last4,
                exp_month: saved.card_exp_month,
                exp_year: saved.card_exp_year,
            }};
        }

        res.status(200).send({
            statusCode: 200,
            data,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}



