const { Transaction } = require("../../../../Database/models");
const { ERRORS } = require("../../../utils/enums");
const { object, number } = require("yup");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id, offset, limit } = req.body;
        const base = Transaction().where({user_id});
        const [{count}] = await base.clone().clearSelect().clearOrder().count('id as count');
        const data = await base.clone().orderBy('created_at', 'desc').offset(offset).limit(limit);
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


