const {sign} = require('jsonwebtoken');
const {compareSync} = require('bcrypt');
const {Admin, Admin_session} = require("../Database/models");
const Helper = require("../Controllers/utils/Helper");
const {ERRORS} = require("../Controllers/utils/enums");

module.exports = class {
    static async login(username, password, ip) {
        const admin = await Admin().where({username}).first();
        if (!admin) throw new Error(ERRORS.USERNAME_PASSWORD_INCORRECT);
        if (!compareSync(password, admin.password)) throw new Error(ERRORS.USERNAME_PASSWORD_INCORRECT);
        if (admin.restricted) throw new Error(ERRORS.ADMIN_RESTRICTED);
        const info = await Helper.getIpInfo(ip);
        const [newSession] = await Admin_session().insert({admin_id: admin.id, ip, info}).returning('id');
        const authObject = {admin_id: admin.id, session_id: newSession.id, level: admin.level}
        const data = {id: admin.id, username, level: admin.level}
        const Authorization = sign(authObject, process.env.JWT_SECRET, {algorithm: 'HS512'});
        return {data, Authorization};
    }

    static async logout(id) {
        return parseInt(await Admin_session().where({id}).del());
    }
    static getAdmin(id) {
        return Admin().select("*").where({id}).first()
    }
    static getAdminSession(id) {
        return Admin_session().where({id}).first();
    }
    static removeAdminSession(id) {
        return Admin_session().where({id}).del();
    }
}