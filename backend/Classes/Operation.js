const {Operation, knex, User} = require("../Database/models");
const {ERRORS, OPERATION_STATUS} = require("../Controllers/utils/enums");
const OTP = require("./OTP");
const {compareSync, hashSync} = require("bcrypt")
const sendMail = require("../Controllers/utils/send-mail")
const {forgotPasswordHtml, passwordUpdatedHtml} = require("../Controllers/utils/html");
const { LoginTicket } = require("google-auth-library");

module.exports = class {

    static async forgotPassword(user_id, name, email) {
        const operationExists = await this.getOperationByName(user_id, name)
        if (operationExists) {
            if (Date.now() > operationExists.created_at + 600000)
                await this.terminateOperation(operationExists.id);
            else throw new Error(ERRORS.OPERATION_IN_PROGRESS);
        }
        const [operation] = await this.generateOperation(user_id, name);
        const trx = await knex.transaction();
        const otp = await OTP.generateOTP(operation.id, trx);
        const sent = await sendMail(email, "Reset Password", forgotPasswordHtml(otp));
        if (!sent) {
            await trx.rollback();
            throw new Error(ERRORS.EMAIL_NOT_SENT);
        }
        await trx.commit();
        await this.updateOperation(operation.id, OPERATION_STATUS.OTP_SENT);
        return operation.created_at;//TODO: use created_at to count down from in frontend
    }

    static async checkOTP(user_id, name, otp) { //TODO: follow the flow and send an email that a password change has happend
        const operationExists = await this.getOperationByName(user_id, name)
        if (!operationExists) {
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        const hashedOTP = await OTP.getOTP(operationExists.id);
        if (Date.now() > operationExists.created_at + 600000 || hashedOTP.tries > 3) {
            await this.terminateOperation(operationExists.id);
            throw new Error(ERRORS.OTP_EXPIRED);
        }
        if (!compareSync(String(otp), hashedOTP.otp)) {
            await OTP.incrementOTPTries(operationExists.id);//TODO: check increments method
            throw new Error(ERRORS.WRONG_OTP);
        }
        await this.updateOperation(operationExists.id, OPERATION_STATUS.OTP_CORRECT);
    }

    static async updatePassword(user_id, name, otp, password, email) {
        const operationExists = await this.getOperationByName(user_id, name)
        if (!operationExists) {
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        const hashedOTP = await OTP.getOTP(operationExists.id);
        if(operationExists.status !== OPERATION_STATUS.OTP_CORRECT) throw new Error(ERRORS.UNAUTHORIZED);
        if (!compareSync(String(otp), hashedOTP.otp)) {
            await this.terminateOperation(operationExists.id);
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        await this.updateOperation(operationExists.id, OPERATION_STATUS.OTP_CORRECT);

        await User().update({password: hashSync(password, 10)}).where({id: user_id});
        await this.closeOperation(operationExists.id);
        await sendMail(email, "Password Updated", passwordUpdatedHtml());
    }

    static async generateOperation(user_id, name, data = {}) {
        return Operation().insert({user_id, name, data}).returning('*');
    }

    static async getOperationByName(user_id, name) {
        return Operation().where({user_id, name}).first();
    }

    static async getOperation(id) {
        return Operation().where({id});
    }

    static async updateOperation(id, status, data = null) {
        const newUpdate = {status};
        if (data) newUpdate.data = data
        return Operation().update(newUpdate).where({id});
    }

    static async terminateOperation(id) {
        return Operation().where({id}).del();
    }
    static async closeOperation(id) { //TODO: make a nice clean history something
        return Operation().where({id}).del();
    }

}