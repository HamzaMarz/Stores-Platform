const handleError = require("../Controllers/utils/handle-error");
const {ERRORS} = require("../Controllers/utils/enums");

module.exports = async (req, res, next) => {
    try {
        if (!req.user?.verified) throw new Error(ERRORS.FORBIDDEN);
        next();
    } catch (e) {
        res.clearCookie("Authorization");
        res.removeHeader("authorization");
        const {status, message} = handleError(e.message);
        if (status === 500) console.error(e);
        res.status(status).send({
            message: message,
            statusCode: status
        });
    }
}



