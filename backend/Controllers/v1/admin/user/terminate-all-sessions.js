const { User_session } = require("../../../../Database/models");
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
        await User_session().where({user_id}).del();
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


