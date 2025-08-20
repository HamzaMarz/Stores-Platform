const {verify} = require('jsonwebtoken');
const handleError = require("../Controllers/utils/handle-error")
const Admin = require("../Classes/Admin")
const {ERRORS} = require("../Controllers/utils/enums")
module.exports = async (req, res, next) => {
    try {
        const Authorization = req.cookies.Authorization || req.headers['authorization'];
        if (!Authorization || Authorization.length < 10) throw new Error(ERRORS.UNAUTHORIZED);
        const client = verify(Authorization, process.env.JWT_SECRET);
        if (!client || !client.session_id) throw new Error(ERRORS.UNAUTHORIZED);
        const session = await Admin.getAdminSession(client.session_id);
        if(!session) throw new Error(ERRORS.UNAUTHORIZED);
        if(session.created_at + 31104000000 < Date.now() ) {
            await Admin.removeAdminSession(client.session_id);
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        const admin = await Admin.getAdmin(client.admin_id);
        if(!admin) throw new Error(ERRORS.UNAUTHORIZED);
        if(admin.restricted) throw new Error(ERRORS.UNAUTHORIZED);
        admin.currentSession = client;
        req.admin = admin;
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