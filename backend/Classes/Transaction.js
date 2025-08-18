const {Transaction, Order} = require("../Database/models");
const {ERRORS} = require("../Controllers/utils/enums");
const Payment = require("./Payment");
const StripeClient = require("./Stripe");

module.exports = class {
	static async createPayment(user_id, order_id, user_payment_id = null) {
		const order = await Order().where({id: order_id, user_id}).first();
		if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
		const amountCents = Math.round(order.total * 100);
		const defaultCard = user_payment_id
			? await Payment.listCards(user_id).where({id: user_payment_id}).first()
			: await Payment.getDefaultCard(user_id);
		if (!defaultCard) throw new Error(ERRORS.VALIDATION_ERROR);
		const customerId = await Payment.ensureStripeCustomer(user_id);
		const intent = await StripeClient.createPaymentIntent({
			amountCents,
			currency: 'usd',
			customerId,
			paymentMethodId: defaultCard.provider_method_id,
			metadata: {order_id: String(order_id), user_id: String(user_id)}
		});
		const [trx] = await Transaction().insert({
			user_id,
			order_id,
			provider: 'stripe',
			payment_intent_id: intent.id,
			user_payment_id: defaultCard.id,
			amount: order.total,
			currency: 'usd',
			status: intent.status
		}).returning('*');
		return {client_secret: intent.client_secret, transaction: trx};
	}

	static async updateStatusByIntentId(payment_intent_id, status, error_message = null) {
		return Transaction().update({status, error_message}).where({payment_intent_id});
	}

	static async getByIntentId(payment_intent_id) {
		return Transaction().where({payment_intent_id}).first();
	}

	static async getPaymentStatus(user_id, order_id) {
		const trx = await Transaction().where({user_id, order_id}).orderBy('created_at', 'desc').first();
		if (!trx) return {status: 'pending'};
		return {status: trx.status, error_message: trx.error_message || null};
	}
}