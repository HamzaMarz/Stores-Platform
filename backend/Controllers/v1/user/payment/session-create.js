const { object, number, string } = require("yup");
const { ERRORS } = require("../../../utils/enums");
const Order = require("../../../../Classes/Order");
const Payment = require("../../../../Classes/Payment");
const StripeClient = require("../../../../Classes/Stripe");

const schema = object({
    order_id: number().min(1).max(1000000000).required(),
    success_url: string().min(5).max(500).required(),
    cancel_url: string().min(5).max(500).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { order_id, success_url, cancel_url } = req.body;
        const order = await Order.getOrder(order_id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        if (order.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        const customerId = await Payment.ensureStripeCustomer(req.user.id);
        const lineItems = (order.products || []).map(p => ({
            price_data: {
                currency: 'usd',
                product_data: { name: p.name },
                unit_amount: Math.round((p.total ? p.total / p.quantity : p.price * (1 - (p.discount || 0)/100)) * 100),
            },
            quantity: p.quantity,
        }));
        const session = await StripeClient.createCheckoutSession({
            customerId,
            lineItems,
            successUrl: success_url,
            cancelUrl: cancel_url,
            metadata: { order_id: String(order_id), user_id: String(req.user.id) }
        });
        res.status(200).send({
            statusCode: 200,
            data: { id: session.id, url: session.url },
            message: 'success'
        });
    } catch (e) {
        next(e);
    }
}


