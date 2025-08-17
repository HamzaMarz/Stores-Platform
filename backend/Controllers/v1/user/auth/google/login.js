const {object, string} = require("yup");
const User = require("../../../../../Classes/User");
const {ERRORS} = require("../../../../utils/enums")
const Helper = require("../../../../utils/Helper");

const schema = object({
    id_token: string().required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {id_token} = req.body;
        const googleData = await Helper.googleAuth2(id_token);
        if (!googleData) throw new Error(ERRORS.VALIDATION_ERROR);
        const ip = req.headers["x-real-ip"] || req.headers ["x-forwarded-for"] || req.connection.remoteAddress;
        const {data, Authorization} = await User.loginGoogle(googleData.email, ip, googleData.picture, googleData.given_name, googleData.family_name);
        res.cookie("Authorization", Authorization, {maxAge: 31104000000});
        res.status(200).send({
            statusCode: 200,
            data,
            Authorization,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}
