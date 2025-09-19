const Order = require("../../../../../Classes/Order");
const DeliverySimulator = require("../../../../../Classes/DeliverySimulator");
const { ERRORS, ORDER_STATUS } = require("../../../../utils/enums");
const { object, number, string } = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    status: string().oneOf([ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED]).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, status } = req.body;
        await Order.updateOrderStatusForSeller(id, req.user.id, status);
        if (status === ORDER_STATUS.SHIPPED) {
            // Fire-and-forget delivery simulation
            try { DeliverySimulator.simulate(id); } catch (_) {}
        }
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


