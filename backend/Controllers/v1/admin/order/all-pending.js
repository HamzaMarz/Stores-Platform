const { Order, User } = require("../../../../Database/models");
const { ERRORS, ORDER_STATUS } = require("../../../utils/enums");
const { object, number } = require("yup");

const schema = object({
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { offset, limit } = req.body;
        const base = Order()
            .join("user", "order.user_id", "user.id")
            .whereIn('order.status', [ORDER_STATUS.CANCELLING]);
        const [{count}] = await base.clone().clearSelect().clearOrder().count("order.id as count");
        const data = await base.clone().select("order.*", "user.first_name", "user.last_name", "user.email").offset(offset).limit(limit).orderBy("order.created_at", "desc");
        res.status(200).send({
            statusCode: 200,
            data,
            count: parseInt(count),
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


