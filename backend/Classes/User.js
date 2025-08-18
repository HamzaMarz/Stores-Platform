const {sign} = require('jsonwebtoken');
const {compareSync, hashSync} = require('bcrypt');
const {User, User_session} = require("../Database/models");
const Helper = require("../Controllers/utils/Helper");
const {ERRORS, OPERATION_NAME, OPERATION_STATUS} = require("../Controllers/utils/enums");
const Operation = require("./Operation");
const {uploadFiles} = require("../Controllers/utils/upload-file");

module.exports = class {
    static async login(email, password, ip) {
        const user = await User().where({email: email.trim().toLowerCase()}).first();
        if (!user) throw new Error(ERRORS.EMAIL_PASSWORD_INCORRECT);
        if (!compareSync(password, user.password)) throw new Error(ERRORS.EMAIL_PASSWORD_INCORRECT);
        if (user.restricted) throw new Error(ERRORS.USER_RESTRICTED);
        const data = {id: user.id, email:user.email , user: user.type}
        const Authorization = await this.createSession(user.id, ip ,user.type);
        return {data, Authorization};
    }
    
//TODO: remove type customer in insert and make it default in database
    static async register(email, password, ip) {
        const userExists = await User().where({email:email.trim().toLowerCase()}).first();
        if (userExists) throw new Error(ERRORS.USER_ALREADY_EXISTS);
        const [user] =  await User().insert({email:email.trim().toLowerCase(),password: hashSync(password, 10), type: "customer"}).returning(['id', 'type']);
        const data = {id: user.id, email, user: user.type}
        const Authorization = await this.createSession(user.id, ip ,user.type);
        return {data, Authorization};
    }

    static async loginGoogle(email, ip, profile_pic, first_name, last_name) {
        let user = await User().where({email:email.trim().toLowerCase()}).first();
        if (user) {
            if (user.restricted) throw new Error(ERRORS.USER_RESTRICTED);
            const data = {id: user.id, email: user.email, user: user.type}
            const Authorization = await this.createSession(user.id, ip ,user.type);
            return {data, Authorization};
        };
        [user] =  await User().insert({email:email.trim().toLowerCase(), profile_pic, first_name, last_name, type: "customer"}).returning(['id', 'type']);
        const data = {id: user.id, email, user: user.type}
        const Authorization = await this.createSession(user.id, ip ,user.type);
        return {data, Authorization};
    }

    static async startOperation(name, data) {
        switch (name){
            case OPERATION_NAME.FORGOT_PASSWORD: return Operation.forgotPassword(data.user_id,data.name, data.email);
        }
    }
    static async updateOperation(status, data) {
        switch (status){
            case OPERATION_STATUS.OTP_SENT: return Operation.checkOTP(data.user_id,data.name, data.otp);
            case OPERATION_STATUS.OTP_CORRECT: return Operation.updatePassword(data.user_id,data.name, data.otp, data.password, data.email);
        }
    }

    static async createSession(id, ip, type){
        const info = await Helper.getIpInfo(ip);
        const [newSession] = await User_session().insert({user_id: id, ip, info}).returning('id');
        const authObject = {user_id: id, session_id: newSession.id, user: type}
        return sign(authObject, process.env.JWT_SECRET, {algorithm: 'HS512'});
    }

    static async changePassword(id, old_pass, password){
        const user = await this.getUser(id);
        if(!user.password) throw new Error(ERRORS.EMAIL_PASSWORD_INCORRECT);
        if(!compareSync(old_pass, user.password)) throw new Error(ERRORS.EMAIL_PASSWORD_INCORRECT);
        return User().update({password: hashSync(password, 10)}).where({id});
    }

    static async editInfo(id, first_name, last_name, phone, bank_name, bank_account){
        const editObj = {};
        if(first_name) editObj.first_name = first_name;
        if(last_name) editObj.last_name = last_name;
        if(phone) editObj.phone = phone;
        if(bank_name) editObj.bank_name = bank_name;
        if(bank_account) editObj.bank_account = bank_account;
        return User().update(editObj).where({id});
    }

    static async updateProfilePic(id, pic, old_pic){
        const urls = await uploadFiles({pic} , "kyc");
        await Helper.removeFileByUrl(old_pic);
        await User().update({profile_pic: urls.pic}).where({id});
    }


    static async logout(id) {
        return parseInt(await User_session().where({id}).del());
    }
    static getUser(id) {
        return User().where({id}).first()
    }
    static getUserByEmail(email) {
        return User().where({email: email.trim().toLowerCase()}).first();
    }
    static getUserSession(session_id) {
        return User_session().where({id: session_id}).first();
    }
    static removeUserSession(session_id) {
        return User_session().where({id: session_id}).del();
    }
    static updatePassword(id, password) {
        return User().update({password}).where({id});
    }
}