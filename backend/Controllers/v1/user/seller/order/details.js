const Order = require("../../../../../Classes/Order");
const { ERRORS } = require("../../../../utils/enums");
const { object, number } = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id } = req.body;
        const order = await Order.getOrderForSeller(id, req.user.id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        res.status(200).send({
            statusCode: 200,
            data: order,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


