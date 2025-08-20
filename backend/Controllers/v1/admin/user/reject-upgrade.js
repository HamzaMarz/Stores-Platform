const { Operation, User } = require("../../../../Database/models");
const { ERRORS, OPERATION_STATUS, OPERATION_NAME } = require("../../../utils/enums");
const { object, number } = require("yup");
const sendMail = require("../../../utils/send-mail");
const { upgradeRejectedHtml } = require("../../../utils/html");

const schema = object({
    operation_id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { operation_id } = req.body;
        const op = await Operation().where({id: operation_id}).first();
        if (!op || op.name !== OPERATION_NAME.UPGRADE) throw new Error(ERRORS.VALIDATION_ERROR);
        await Operation().update({status: OPERATION_STATUS.UPGRADE_REJECTED}).where({id: operation_id});
        try {
            const user = await User().where({id: op.user_id}).first();
            if (user?.email) await sendMail(user.email, 'Upgrade rejected', upgradeRejectedHtml());
        } catch (_) {}
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


