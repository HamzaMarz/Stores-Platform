const { User } = require("../../../../Database/models");
const { ERRORS } = require("../../../utils/enums");
const { object, number } = require("yup");
const { hashSync } = require('bcrypt');
const sendMail = require("../../../utils/send-mail");
const { adminResetPasswordHtml } = require("../../../utils/html");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
});

function generateTempPassword(length = 12) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let out = '';
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id } = req.body;
        const user = await User().where({id: user_id}).first();
        if (!user) throw new Error(ERRORS.VALIDATION_ERROR);
        const password = generateTempPassword();
        await User().update({password: hashSync(password, 10)}).where({id: user_id});
        try {
            if (user?.email) await sendMail(user.email, 'Password reset', adminResetPasswordHtml(password));
        } catch (_) {}
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};


