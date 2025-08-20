const Order = require("../../../../../Classes/Order");
const { ERRORS } = require("../../../../utils/enums");
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
        const { data, count } = await Order.getSellerOrders(req.user.id, offset, limit);
        res.status(200).send({
            statusCode: 200,
            data,
            count,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


