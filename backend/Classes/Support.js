const {Support_ticket, Support_messages, knex} = require("../Database/models");
const {ERRORS, SUPPORT_TICKET_STATUS} = require("../Controllers/utils/enums");

module.exports = class {
    static messagesQuery = (limit = 20, offset = 0) => {
        return knex.select(
            "support_messages.*",
            "user.first_name as user_name",
            "user.profile_pic as user_pic",
            "admin.username as admin_name"
        )
            .from("support_messages")
            .leftJoin("user", "support_messages.user_id", "user.id")
            .leftJoin("admin", "support_messages.admin_id", "admin.id")
            .orderBy("support_messages.created_at", "asc")
            .limit(limit)
            .offset(offset)
            .as("messages");
    }
    
    static async createTicket(user_id, topic, description) {
        const [ticket] = await Support_ticket().insert({
            user_id,
            topic,
            description,
            status: SUPPORT_TICKET_STATUS.OPEN
        }).returning('*');
        
        return ticket;
    }
    
    static async getTicket(id) {
        return Support_ticket().where({id}).first();
    }
    
    static async getUserTickets(user_id, offset, limit, order = {column: "created_at", direction: "desc"}) {
        const base = Support_ticket().where({user_id});
        const countRow = await base.clone().clearSelect().clearOrder().clear('limit').clear('offset').count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        const data = await base.clone().offset(offset).limit(limit).orderBy(order.column, order.direction);
        return {data, count};
    }
    
    static async getTicketWithMessages(id, messages_limit, messages_offset) {
        const ticket = await Support_ticket().where({id}).first();
        if (!ticket) throw new Error(ERRORS.TICKET_DOES_NOT_EXIST);

        const messages = await Support_messages()
            .select(
                "support_messages.*",
                "user.first_name as user_name",
                "user.profile_pic as user_pic",
                "admin.username as admin_name"
            )
            .leftJoin("user", "support_messages.user_id", "user.id")
            .leftJoin("admin", "support_messages.admin_id", "admin.id")
            .where({"support_messages.support_ticket_id": id})
            .orderBy("support_messages.created_at", "asc")
            .limit(messages_limit)
            .offset(messages_offset);

        return {...ticket, messages};
    }
    
    static async updateTicketStatus(id, status, admin_id = null, upgrade_message = null) {
        const updateData = {status};
        if (admin_id) updateData.admin_id = admin_id;
        if (upgrade_message) updateData.upgrade_message = upgrade_message;
        
        return Support_ticket().update(updateData).where({id});
    }
    
    static async sendUserMessage(ticket_id, user_id, message, attachment = null) {
        const ticket = await this.getTicket(ticket_id);
        if (!ticket) throw new Error(ERRORS.TICKET_DOES_NOT_EXIST);
        if (ticket.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (ticket.status === SUPPORT_TICKET_STATUS.CLOSED) throw new Error(ERRORS.TICKET_ALREADY_CLOSED);
        
        const [newMessage] = await Support_messages().insert({
            support_ticket_id: ticket_id,
            user_id,
            message,
            attachment
        }).returning('*');
        
        // Update ticket status if it was waiting for user
        if (ticket.status === SUPPORT_TICKET_STATUS.WAITING_FOR_USER) {
            await this.updateTicketStatus(ticket_id, SUPPORT_TICKET_STATUS.IN_PROGRESS);
        }
        
        return newMessage;
    }
    
    static async sendAdminMessage(ticket_id, admin_id, message, attachment = null) {
        const ticket = await this.getTicket(ticket_id);
        if (!ticket) throw new Error(ERRORS.TICKET_DOES_NOT_EXIST);
        if (ticket.status === SUPPORT_TICKET_STATUS.CLOSED) throw new Error(ERRORS.TICKET_ALREADY_CLOSED);
        
        const [newMessage] = await Support_messages().insert({
            support_ticket_id: ticket_id,
            admin_id,
            message,
            attachment
        }).returning('*');
        
        // Update ticket admin if not assigned
        if (!ticket.admin_id) {
            await Support_ticket().update({admin_id}).where({id: ticket_id});
        }
        
        return newMessage;
    }
    
    static async closeTicket(id, user_id) {
        const ticket = await this.getTicket(id);
        if (!ticket) throw new Error(ERRORS.TICKET_DOES_NOT_EXIST);
        if (ticket.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (ticket.status === SUPPORT_TICKET_STATUS.CLOSED) throw new Error(ERRORS.TICKET_ALREADY_CLOSED);
        
        return this.updateTicketStatus(id, SUPPORT_TICKET_STATUS.CLOSED);
    }
    
    static async rateTicket(id, user_id, rating, review = null) {
        const ticket = await this.getTicket(id);
        if (!ticket) throw new Error(ERRORS.TICKET_DOES_NOT_EXIST);
        if (ticket.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (ticket.status !== SUPPORT_TICKET_STATUS.CLOSED && ticket.status !== SUPPORT_TICKET_STATUS.RESOLVED) {
            throw new Error(ERRORS.VALIDATION_ERROR);
        }
        
        return Support_ticket().update({rating, review}).where({id});
    }
} 