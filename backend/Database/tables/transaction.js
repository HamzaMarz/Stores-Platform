const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.integer('order_id').unsigned();
    table.string('provider').defaultTo('stripe');
    table.string('payment_intent_id');
    table.integer('user_payment_id');
    table.float('amount');
    table.string('currency').defaultTo('usd');
    table.string('status').defaultTo('pending');
    table.string('error_message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
    table.foreign('order_id').references('order.id');
    table.foreign('user_payment_id').references('user_payment.id');
}

