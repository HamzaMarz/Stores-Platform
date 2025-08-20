const { Order, User } = require("../../../../Database/models");
const { ERRORS, ORDER_STATUS } = require("../../../utils/enums");
const { object, number } = require("yup");
const sendMail = require("../../../utils/send-mail");

const schema = object({
    id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id } = req.body;
        const order = await Order().where({id}).first();
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        await Order().update({status: ORDER_STATUS.BLOCKED}).where({id});
        try {
            const user = await User().where({id: order.user_id}).first();
            if (user?.email) await sendMail(user.email, 'Refund rejected', `<p>Your refund request for order #${order.id} has been rejected. The order is blocked. Please contact support to appeal.</p>`);
        } catch (_) {}
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


