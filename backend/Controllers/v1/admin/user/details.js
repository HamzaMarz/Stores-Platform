const { User, User_session, User_payment, Support_ticket, Rating, Order, Transaction } = require("../../../../Database/models");
const { ERRORS } = require("../../../utils/enums");
const { object, number } = require("yup");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id } = req.body;
        const user = await User().where({id: user_id}).first();
        if (!user) throw new Error(ERRORS.VALIDATION_ERROR);
        const [{count: sessions_count}] = await User_session().where({user_id}).count('id as count');
        const [{count: payment_methods_count}] = await User_payment().where({user_id}).count('id as count');
        const [{count: open_support_count}] = await Support_ticket().where({user_id}).whereNot({status: 'CLOSED'}).count('id as count');
        const [{count: ratings_count}] = await Rating().where({user_id}).count('id as count');
        const [{count: orders_count}] = await Order().where({user_id}).count('id as count');
        const [{sum: total_paid}] = await Transaction().where({user_id, status: 'succeeded'}).sum('amount as sum');
        res.status(200).send({
            statusCode: 200,
            data: {
                user,
                sessions_count: parseInt(sessions_count) || 0,
                payment_methods_count: parseInt(payment_methods_count) || 0,
                open_support_count: parseInt(open_support_count) || 0,
                ratings_count: parseInt(ratings_count) || 0,
                orders_count: parseInt(orders_count) || 0,
                total_paid: parseFloat(total_paid) || 0,
            },
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


