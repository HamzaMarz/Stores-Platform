const StripeClient = require("../../../Classes/Stripe");
const Transaction = require("../../../Classes/Transaction");
const Order = require("../../../Classes/Order");

module.exports = async (req, res, next) => {
	try {
		const signature = req.headers['stripe-signature'];
		const event = StripeClient.verifyWebhook(signature, req.body);
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const intent = event.data.object;
				await Transaction.updateStatusByIntentId(intent.id, 'succeeded');
				const trx = await Transaction.getByIntentId(intent.id);
				if (trx?.order_id) await Order.markAsPaid(trx.order_id);
				break;
			}
			case 'payment_intent.payment_failed': {
				const intent = event.data.object;
				await Transaction.updateStatusByIntentId(intent.id, 'failed', intent.last_payment_error?.message || null);
				break;
			}
			case 'setup_intent.succeeded': {
				// Frontend should call save-card with payment method id
				break;
			}
			default:
				break;
		}
		res.json({received: true});
	} catch (e) {
		next(e);
	}
}


