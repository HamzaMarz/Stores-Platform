const {verify} = require('jsonwebtoken');
const handleError = require("../Controllers/utils/handle-error")
const User = require("../Classes/User")
const {ERRORS} = require("../Controllers/utils/enums")
module.exports = async (req, res, next) => {
    try {
        const Authorization = req.cookies.Authorization || req.headers['authorization'];
        if (!Authorization || Authorization.length < 10) throw new Error(ERRORS.UNAUTHORIZED);
        const client = verify(Authorization, process.env.JWT_SECRET);
        if (!client || !client.session_id) throw new Error(ERRORS.UNAUTHORIZED);
        const session = await User.getUserSession(client.session_id);
        if(!session) throw new Error(ERRORS.UNAUTHORIZED);
        const expire = session.temp? 600000 : 31104000000;
        if(session.created_at + expire < Date.now() ) {
            await User.removeUserSession(client.session_id);
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        const user = await User.getUser(client.user_id);
        if(!user) throw new Error(ERRORS.UNAUTHORIZED);
        if(user.restricted) throw new Error(ERRORS.UNAUTHORIZED);
        user.currentSession = client;
        req.user = user;
        next();
    } catch (e) {
        res.clearCookie("Authorization");
        res.removeHeader("authorization");
        const isJwtError = e?.name === 'JsonWebTokenError' || e?.name === 'TokenExpiredError' || String(e?.message || '').toLowerCase().includes('invalid token') || String(e?.message || '').toLowerCase().includes('jwt');
        const {status, message} = handleError(isJwtError ? ERRORS.UNAUTHORIZED : e.message);
        if (status === 500) console.error(e);
        res.status(status).send({
            message: message,
            statusCode: status
        });
    }
}