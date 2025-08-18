const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.string('provider').defaultTo('stripe');
    table.string('provider_customer_id');
    table.string('provider_method_id');
    table.boolean('default').defaultTo(false);
    table.string('card_brand');
    table.string('card_last4');
    table.string('card_exp_month');
    table.string('card_exp_year');
    table.boolean('deleted').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

