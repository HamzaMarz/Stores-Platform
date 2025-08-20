const { Transaction, Order, User, Product } = require("../../../../Database/models");
const { ERRORS, ORDER_STATUS } = require("../../../utils/enums");
const { object, number } = require("yup");
const StripeClient = require("../../../../Classes/Stripe");
const sendMail = require("../../../utils/send-mail");
const { verifyEmailHtml } = require("../../../utils/html");

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
        // Find last transaction for order
        const trx = await Transaction().where({order_id: id}).orderBy('created_at', 'desc').first();
        if (trx?.payment_intent_id) {
            try {
                await StripeClient.refundPaymentIntent(trx.payment_intent_id);
            } catch (_) {}
        }
        await Order().update({status: ORDER_STATUS.CANCELLED}).where({id});
        // Notify user and sellers
        try {
            const user = await User().where({id: order.user_id}).first();
            if (user?.email) await sendMail(user.email, 'Order cancelled and refunded', `<p>Your order #${order.id} was cancelled and refunded.</p>`);
        } catch (_) {}
        try {
            const productIds = (order.products || []).map(p => p.id);
            if (productIds.length) {
                const owners = await Product().distinct('user_id').whereIn('id', productIds);
                const ownerIds = owners.map(o => o.user_id);
                if (ownerIds.length) {
                    const sellerUsers = await User().select('email').whereIn('id', ownerIds).whereNotNull('email');
                    for (const s of sellerUsers) {
                        if (s.email) await sendMail(s.email, 'Order cancelled', `<p>An order containing your products (#${order.id}) was cancelled and refunded.</p>`);
                    }
                }
            }
        } catch (_) {}
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


