const Order = require('./Order');
const {ORDER_STATUS} = require('../Controllers/utils/enums');

module.exports = class {
    static async simulate(orderId) {
        // Simulate carrier updates over time in the background
        // Immediately move to SHIPPED if not already
        setTimeout(async () => {
            try { await Order.updateOrderStatus(orderId, ORDER_STATUS.SHIPPED); } catch (_) {}
        }, 1000);
        // After some time, mark as delivered by carrier (awaiting user confirm)
        setTimeout(async () => {
            try { await Order.setCarrierDelivered(orderId); } catch (_) {}
        }, 1000 * 20);
    }
}


