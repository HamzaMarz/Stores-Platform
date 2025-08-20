const { Operation, User } = require("../../../../Database/models");
const { ERRORS, OPERATION_NAME, OPERATION_STATUS } = require("../../../utils/enums");
const { object, number } = require("yup");

const schema = object({
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { offset, limit } = req.body;
        const base = Operation()
            .select('operation.*', 'user.email')
            .join("user", "operation.user_id", "user.id")
            .where({ name: OPERATION_NAME.UPGRADE })
            .andWhere({ status: OPERATION_STATUS.UPGRADE_REQUESTED })
            .orderBy('operation.created_at', 'desc');
        const [{count}] = await base.clone().clearSelect().clearOrder().count('operation.id as count');
        const rows = await base.clone().offset(offset).limit(limit);
        const data = rows.map(r => {
            const payload = typeof r.data === 'string' ? (() => { try { return JSON.parse(r.data) } catch { return null } })() : r.data;
            return {
                ...r,
                target_type: payload?.target
            };
        });
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


