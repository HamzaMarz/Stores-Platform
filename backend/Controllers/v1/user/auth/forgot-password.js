const {object, string} = require('yup');
const User = require("../../../../Classes/User")
const {ERRORS, OPERATION_NAME} = require("../../../utils/enums");
const schema = object({
    email: string().email().max(255).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {email} = req.body;
        const user = await User.getUserByEmail(email);
        if (!user || user.restricted) throw new Error(ERRORS.VALIDATION_ERROR);
        const created_at = await User.startOperation(OPERATION_NAME.FORGOT_PASSWORD, {user_id: user.id, name: OPERATION_NAME.FORGOT_PASSWORD, email: user.email});
        res.status(200).send({
            statusCode: 200,
            message: 'An email has been sent to you for further instructions.',
            created_at
        });
    } catch (e) {
        next(e);
    }
}