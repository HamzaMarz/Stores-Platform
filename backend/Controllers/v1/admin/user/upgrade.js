const { Operation, User } = require("../../../../Database/models");
const { ERRORS, OPERATION_STATUS, OPERATION_NAME } = require("../../../utils/enums");
const { object, number, string } = require("yup");
const sendMail = require("../../../utils/send-mail");
const { upgradeApprovedHtml } = require("../../../utils/html");

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
        const target = op.data?.target;
        await Operation().update({status: OPERATION_STATUS.UPGRADE_APPROVED}).where({id: operation_id});
        if (target) await User().update({type: target}).where({id: op.user_id});
        // Notify user
        try {
            const user = await User().where({id: op.user_id}).first();
            if (user?.email) await sendMail(user.email, 'Upgrade approved', upgradeApprovedHtml(target));
        } catch (_) {}
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


