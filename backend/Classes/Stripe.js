const Stripe = require('stripe');
const {User_payment} = require("../Database/models");

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion: '2024-06-20'});

module.exports = class {
	static getClient() {
		return stripe;
	}

	static async ensureCustomer(email, metadata = {}) {
		const customer = await stripe.customers.create({
			email: email?.trim()?.toLowerCase(),
			metadata
		});
		return customer;
	}

	static async createSetupIntent(customerId) {
		return stripe.setupIntents.create({
			customer: customerId,
			payment_method_types: ['card']
		});
	}

	static async retrievePaymentMethod(paymentMethodId) {
		return stripe.paymentMethods.retrieve(paymentMethodId);
	}

	static async listPaymentMethods(customerId) {
		return stripe.paymentMethods.list({customer: customerId, type: 'card'});
	}

	static async detachPaymentMethod(paymentMethodId) {
		return stripe.paymentMethods.detach(paymentMethodId);
	}

	static async createPaymentIntent({amountCents, currency = 'usd', customerId, paymentMethodId = null, metadata = {}, confirm = true, offSession = true}) {
		const params = {
			amount: amountCents,
			currency,
			customer: customerId,
			metadata
		};
		if (paymentMethodId) params.payment_method = paymentMethodId;
		if (confirm) params.confirm = true;
		if (offSession) params.off_session = true;
		return stripe.paymentIntents.create(params);
	}

	static verifyWebhook(signature, rawBody) {
		if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is required');
		return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
	}

	static async refundPaymentIntent(paymentIntentId, amountCents = null) {
		const params = {payment_intent: paymentIntentId};
		if (amountCents) params.amount = amountCents;
		return stripe.refunds.create(params);
	}
}