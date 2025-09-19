const Cart = require("../../../../Classes/Cart");
const Order = require("../../../../Classes/Order");
const Transaction = require("../../../../Classes/Transaction");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    address: string().min(5).max(500).required(),
    message: string().max(500),
    user_payment_id: number().min(1).max(1000000000),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, address, message, user_payment_id } = req.body;

        await Cart.checkCartTotal(id);
        const order = await Order.createOrder(req.user.id, id, address, message);
        // Attempt to immediately create a payment intent using user's default card
        let payment = null;
        try {
            const created = await Transaction.createPayment(req.user.id, order.id, user_payment_id || null);
            payment = { client_secret: created.client_secret, status: created.transaction.status };
        } catch (_) {}

        res.status(200).send({
            statusCode: 200,
            data: { order, payment },
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};