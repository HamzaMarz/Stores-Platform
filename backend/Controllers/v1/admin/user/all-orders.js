const { Order } = require("../../../../Database/models");
const { ERRORS } = require("../../../utils/enums");
const { object, number, string } = require("yup");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
    status: string(),
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id, status, offset, limit } = req.body;
        const base = Order().where({user_id});
        if (status) base.andWhere({status});
        const [{count}] = await base.clone().clearSelect().clearOrder().count('id as count');
        const data = await base.clone().offset(offset).limit(limit).orderBy('created_at', 'desc');
        res.status(200).send({
            statusCode: 200,
            data,
            count: parseInt(count),
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


