const { object, string } = require("yup");
const Operation = require("../../../../Classes/Operation");
const {ERRORS, OPERATION_NAME} = require("../../../utils/enums");

// step: 'start' | 'status'
// target: 'merchant' | 'store'
const schema = object({
    step: string().oneOf(['start', 'status']).required(),
    target: string().oneOf(['merchant', 'store'])
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { step, target } = req['body'];
        const user_id = req.user.id;

        let data = null;
        if (step === 'start') {
            data = await Operation.startUpgrade(user_id, target);
        } else if (step === 'status') {
            data = await Operation.upgradeStatus(user_id);
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


