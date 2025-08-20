const {Support_ticket, knex} = require("../../../../Database/models");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
    status: string(),
    order: object({
        column: string()
            .oneOf(["created_at", "updated_at", "status"])
            .required(),
        direction: string().oneOf(["asc", "desc"]).required(),
    }).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { offset, limit, status, order } = req.body;
        
        const base = Support_ticket()
            .join("user", "support_ticket.user_id", "user.id");
        if (status) base.where({status});
        const [{count}] = await base.clone().clearSelect().clearOrder().count("support_ticket.id as count");
        const data = await base.clone().select("support_ticket.*", "user.first_name", "user.last_name", "user.email").offset(offset).limit(limit).orderBy(`support_ticket.${order.column}`, order.direction);
        
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