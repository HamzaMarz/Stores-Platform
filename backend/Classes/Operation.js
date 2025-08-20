const {Operation, knex, User} = require("../Database/models");
const {ERRORS, OPERATION_STATUS, OPERATION_NAME} = require("../Controllers/utils/enums");
const OTP = require("./OTP");
const {compareSync, hashSync} = require("bcrypt")
const sendMail = require("../Controllers/utils/send-mail")
const {forgotPasswordHtml, passwordUpdatedHtml, verifyEmailHtml} = require("../Controllers/utils/html");
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

    static async startVerifyEmail(user_id, email) {
        const operationExists = await this.getOperationByName(user_id, OPERATION_NAME.VERIFY_EMAIL)
        if (operationExists) {
            if (Date.now() > operationExists.created_at + 600000)
                await this.terminateOperation(operationExists.id);
            else throw new Error(ERRORS.OPERATION_IN_PROGRESS);
        }
        const [operation] = await this.generateOperation(user_id, OPERATION_NAME.VERIFY_EMAIL);
        const trx = await knex.transaction();
        const otp = await OTP.generateOTP(operation.id, trx);
        const sent = await sendMail(email, "Verify your email", verifyEmailHtml(otp));
        if (!sent) {
            await trx.rollback();
            throw new Error(ERRORS.EMAIL_NOT_SENT);
        }
        await trx.commit();
        await this.updateOperation(operation.id, OPERATION_STATUS.OTP_SENT);
        return operation.created_at;
    }

    static async checkVerifyEmailOTP(user_id, otp) {
        const operationExists = await this.getOperationByName(user_id, OPERATION_NAME.VERIFY_EMAIL)
        if (!operationExists) throw new Error(ERRORS.UNAUTHORIZED);
        const hashedOTP = await OTP.getOTP(operationExists.id);
        if (Date.now() > operationExists.created_at + 600000 || hashedOTP.tries > 3) {
            await this.terminateOperation(operationExists.id);
            throw new Error(ERRORS.OTP_EXPIRED);
        }
        if (!compareSync(String(otp), hashedOTP.otp)) {
            await OTP.incrementOTPTries(operationExists.id);
            throw new Error(ERRORS.WRONG_OTP);
        }
        await this.updateOperation(operationExists.id, OPERATION_STATUS.OTP_CORRECT);
    }

    static async completeVerifyEmail(user_id) {
        const operationExists = await this.getOperationByName(user_id, OPERATION_NAME.VERIFY_EMAIL)
        if (!operationExists) throw new Error(ERRORS.UNAUTHORIZED);
        if (operationExists.status !== OPERATION_STATUS.OTP_CORRECT) throw new Error(ERRORS.UNAUTHORIZED);
        await User().update({verified: true}).where({id: user_id});
        await this.closeOperation(operationExists.id);
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

    // Upgrade flow
    static async startUpgrade(user_id, target) {
        const user = await User().where({id: user_id}).first();
        if (!user) throw new Error(ERRORS.UNAUTHORIZED);
        // Only allow upgrades from customer to merchant/store and not to the same role
        if (user.type === target) throw new Error(ERRORS.VALIDATION_ERROR);
        if (user.type !== 'customer') throw new Error(ERRORS.VALIDATION_ERROR);
        const existing = await Operation().where({user_id, name: OPERATION_NAME.UPGRADE}).orderBy('created_at', 'desc');
        const hasActive = existing.find(o => [OPERATION_STATUS.UPGRADE_REQUESTED, OPERATION_STATUS.UPGRADE_APPROVED].includes(o.status));
        if (hasActive) throw new Error(ERRORS.OPERATION_IN_PROGRESS);
        const [op] = await this.generateOperation(user_id, OPERATION_NAME.UPGRADE, {target});
        await this.updateOperation(op.id, OPERATION_STATUS.UPGRADE_REQUESTED);
        return { id: op.id, created_at: op.created_at, target };
    }

    static async upgradeStatus(user_id) {
        const list = await Operation().where({user_id, name: OPERATION_NAME.UPGRADE}).orderBy('created_at', 'desc');
        const active = list.find(o => o.status && [OPERATION_STATUS.UPGRADE_REQUESTED, OPERATION_STATUS.UPGRADE_APPROVED].includes(o.status));
        const rejected = list.filter(o => o.status === OPERATION_STATUS.UPGRADE_REJECTED);
        return {
            active: active ? { id: active.id, status: active.status, target: active.data?.target, created_at: active.created_at } : null,
            rejected: rejected.map(r => ({ id: r.id, status: r.status, target: r.data?.target, created_at: r.created_at })),
        };
    }

}