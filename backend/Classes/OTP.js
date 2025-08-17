const {hashSync} = require('bcrypt');
const {Otp} = require("../Database/models");
module.exports = class {
    static async generateOTP(operation_id, trx) {
        const otp =  String(parseInt(Math.random() * 10000)).padStart(4 , '0');
        await Otp().insert({otp: hashSync(otp, 10), operation_id}).transacting(trx);
        return otp;
    }
    static async getOTP(operation_id) {
        return Otp().where({operation_id}).first();
    }
    static async incrementOTPTries(operation_id) {
        return Otp().where({operation_id}).increment('tries');
    }
}