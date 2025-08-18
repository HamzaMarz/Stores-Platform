const {User_payment, User, knex} = require("../Database/models");
const {ERRORS} = require("../Controllers/utils/enums");
const StripeClient = require("./Stripe");
const sendMail = require("../Controllers/utils/send-mail");
const {cardRemovedHtml, cardAddedHtml} = require("../Controllers/utils/html");

module.exports = class {
	static async getStripeCustomerId(user_id) {
		const existing = await User_payment().where({user_id, deleted: false}).first();
		return existing?.provider_customer_id || null;
	}

	static async ensureStripeCustomer(user_id) {
		const existingCustomerId = await this.getStripeCustomerId(user_id);
		if (existingCustomerId) return existingCustomerId;
		const user = await User().where({id: user_id}).first();
		const customer = await StripeClient.ensureCustomer(user?.email, {user_id: String(user_id)});
		// Persist placeholder row to keep customerId consistent across flows
		await User_payment().insert({
			user_id,
			provider: 'stripe',
			provider_customer_id: customer.id,
			provider_method_id: null,
			default: false,
			deleted: false,
		}).returning('id');
		return customer.id;
	}

	static async createAddCardIntent(user_id) {
		const customerId = await this.ensureStripeCustomer(user_id);
		const intent = await StripeClient.createSetupIntent(customerId);
		return {client_secret: intent.client_secret};
	}

	static async savePaymentMethod(user_id, payment_method_id, trx = null) {
		const customerId = await this.ensureStripeCustomer(user_id);
		const pm = await StripeClient.retrievePaymentMethod(payment_method_id);
		if (!pm || pm.customer !== customerId) throw new Error(ERRORS.UNAUTHORIZED);
		const isFirst = !(await User_payment().where({user_id, deleted: false}).whereNotNull('provider_method_id').first());
		const executor = trx ? (q) => q.transacting(trx) : (q) => q;
		// If we have a placeholder row without provider_method_id, update it, otherwise insert new
		const placeholder = await User_payment().where({user_id, provider_customer_id: customerId, deleted: false}).whereNull('provider_method_id').first();
		let saved;
		if (placeholder) {
			[saved] = await executor(User_payment()).update({
				provider_method_id: pm.id,
				default: isFirst,
				card_brand: pm.card?.brand || pm.card?.wallet || null,
				card_last4: pm.card?.last4 || null,
				card_exp_month: pm.card?.exp_month ? String(pm.card.exp_month) : null,
				card_exp_year: pm.card?.exp_year ? String(pm.card.exp_year) : null,
			}).where({id: placeholder.id}).returning('*');
		} else {
			[saved] = await executor(User_payment()).insert({
				user_id,
				provider: 'stripe',
				provider_customer_id: customerId,
				provider_method_id: pm.id,
				default: isFirst,
				card_brand: pm.card?.brand || pm.card?.wallet || null,
				card_last4: pm.card?.last4 || null,
				card_exp_month: pm.card?.exp_month ? String(pm.card.exp_month) : null,
				card_exp_year: pm.card?.exp_year ? String(pm.card.exp_year) : null,
			}).returning('*');
		}
		// Notify user on successful add
		try {
			const user = await User().where({id: user_id}).first();
			if (user?.email && saved.card_last4) {
				await sendMail(user.email, 'Payment method added', cardAddedHtml(saved.card_last4));
			}
		} catch (_) {}
		return saved;
	}

	static async listCards(user_id) {
		return User_payment().where({user_id, deleted: false}).whereNotNull('provider_method_id').orderBy('created_at', 'desc');
	}

	static async setDefault(user_id, user_payment_id) {
		const trx = await knex.transaction();
		try {
			await User_payment().update({default: false}).where({user_id}).transacting(trx);
			await User_payment().update({default: true}).where({id: user_payment_id, user_id}).transacting(trx);
			await trx.commit();
		} catch (e) {
			await trx.rollback();
			throw e;
		}
	}

	static async deleteCard(user_id, user_payment_id) {
		const record = await User_payment().where({id: user_payment_id}).first();
		if (!record) throw new Error(ERRORS.CARD_DOES_NOT_EXIST);
		if (record.user_id !== user_id) throw new Error(ERRORS.UNAUTHORIZED);
		if (record.deleted) throw new Error(ERRORS.CARD_DOES_NOT_EXIST);
		try {
			if (record.provider_method_id) {
				await StripeClient.detachPaymentMethod(record.provider_method_id);
			}
		} catch (_) {}
		await User_payment().update({deleted: true, default: false}).where({id: user_payment_id});
		// Notify user via email
		try {
			const user = await User().where({id: user_id}).first();
			if (user?.email && record.card_last4) {
				await sendMail(user.email, 'Payment method removed', cardRemovedHtml(record.card_last4));
			}
		} catch (_) {}
		const remainingDefault = await User_payment().where({user_id, deleted: false, default: true}).first();
		if (!remainingDefault) {
			const any = await User_payment().where({user_id, deleted: false}).first();
			if (any) await User_payment().update({default: true}).where({id: any.id});
		}
	}

	static async getDefaultCard(user_id) {
		return User_payment().where({user_id, deleted: false, default: true}).first();
	}
}