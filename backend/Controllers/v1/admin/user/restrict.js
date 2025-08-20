const { User } = require("../../../../Database/models");
const { ERRORS } = require("../../../utils/enums");
const { object, number, boolean } = require("yup");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
    restricted: boolean().required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id, restricted } = req.body;
        await User().update({restricted}).where({id: user_id});
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


