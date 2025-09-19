const {Order, Cart, Cart_product, Product, knex} = require("../Database/models");
const {ERRORS, ORDER_STATUS} = require("../Controllers/utils/enums");

module.exports = class {
    static async createOrder(user_id, cart_id, address, message = null) {
        const cart = await Cart().where({id: cart_id, user_id}).first();
        if (!cart) throw new Error(ERRORS.CART_DOES_NOT_EXIST);
        
        const cartProducts = await Cart_product()
            .select("cart_product.*", "product.name", "product.price", "product.discount", "product.thumbnail_image")
            .join("product", "cart_product.product_id", "product.id")
            .where({cart_id});
        
        if (cartProducts.length === 0) throw new Error(ERRORS.CART_IS_EMPTY);
        
        const products = cartProducts.map(item => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            discount: item.discount,
            quantity: item.quantity,
            thumbnail_image: item.thumbnail_image,
            total: item.price * (1 - item.discount/100) * item.quantity
        }));
        
        const [order] = await Order().insert({
            user_id,
            products,
            total: cart.total,
            message,
            paid: false,
            delivery: false,
            status: ORDER_STATUS.PENDING,
            address
        }).returning('*');
        
        // Clear the cart after order creation
        await Cart_product().where({cart_id}).del();
        await Cart().update({total: 0}).where({id: cart_id});
        
        return order;
    }
    
    static async getOrder(id) {
        return Order().where({id}).first();
    }
    
    static async getUserOrders(user_id, offset, limit, order = {column: "created_at", direction: "desc"}) {
        const query = Order().where({user_id});
        const [{count}] = await query.count("id as count");
        const data = await query.offset(offset).limit(limit).orderBy(order.column, order.direction);
        return {data, count: parseInt(count)};
    }
    
    static async getSellerOrders(seller_user_id, offset, limit) {
        // Get distinct order IDs where any product in the order belongs to the seller
        const idsRows = await Order()
            .select('order.id')
            .joinRaw('JOIN LATERAL json_array_elements("order".products) AS p(item) ON TRUE')
            .join('product', 'product.id', knex.raw("(p.item->>'id')::int"))
            .where('product.user_id', seller_user_id)
            .distinct()
            .orderBy('order.created_at', 'desc')
            .offset(offset)
            .limit(limit);
        const ids = idsRows.map(r => r.id);
        const countRes = await Order()
            .joinRaw('JOIN LATERAL json_array_elements("order".products) AS p(item) ON TRUE')
            .join('product', 'product.id', knex.raw("(p.item->>'id')::int"))
            .where('product.user_id', seller_user_id)
            .countDistinct({count: 'order.id'});
        const count = parseInt(countRes[0]?.count || 0);
        if (ids.length === 0) return {data: [], count};
        const orders = await Order().whereIn('id', ids).orderBy('created_at', 'desc');
        // Collect all product IDs from these orders
        const allProductIds = Array.from(new Set(orders.flatMap(o => (o.products || []).map(p => p.id))));
        const ownedRows = allProductIds.length ? await Product().select('id').whereIn('id', allProductIds).andWhere({user_id: seller_user_id}) : [];
        const ownedSet = new Set(ownedRows.map(r => r.id));
        const data = orders.map(o => {
            const filteredProducts = (o.products || []).filter(p => ownedSet.has(p.id));
            const total = filteredProducts.reduce((sum, p) => sum + (p.total ?? (p.price * (1 - (p.discount || 0)/100) * p.quantity)), 0);
            return {...o, products: filteredProducts, total};
        });
        return {data, count};
    }
    
    static async updateOrderStatus(id, status) {
        return Order().update({status}).where({id});
    }
    
    static async getOrderForSeller(id, seller_user_id) {
        const order = await this.getOrder(id);
        if (!order) return null;
        const products = order.products || [];
        const productIds = products.map(p => p.id);
        if (productIds.length === 0) return null;
        const owned = await Product().select('id').whereIn('id', productIds).andWhere({user_id: seller_user_id});
        if (owned.length === 0) return null;
        const ownedSet = new Set(owned.map(r => r.id));
        const filteredProducts = products.filter(p => ownedSet.has(p.id));
        const total = filteredProducts.reduce((sum, p) => sum + (p.total ?? (p.price * (1 - (p.discount || 0)/100) * p.quantity)), 0);
        return {...order, products: filteredProducts, total};
    }
    
    static async updateOrderStatusForSeller(id, seller_user_id, nextStatus) {
        const order = await this.getOrder(id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        // Ensure the seller owns at least one product in this order
        const products = order.products || [];
        const productIds = products.map(p => p.id);
        if (productIds.length === 0) throw new Error(ERRORS.VALIDATION_ERROR);
        const owned = await Product().select('id').whereIn('id', productIds).andWhere({user_id: seller_user_id});
        if (owned.length === 0) throw new Error(ERRORS.VALIDATION_ERROR);
        // Allowed transitions: CONFIRMED -> PROCESSING, PROCESSING -> SHIPPED (treated as "ready")
        const current = order.status;
        const allowed = (current === ORDER_STATUS.CONFIRMED && nextStatus === ORDER_STATUS.PROCESSING)
            || (current === ORDER_STATUS.PROCESSING && nextStatus === ORDER_STATUS.SHIPPED);
        if (!allowed) throw new Error(ERRORS.VALIDATION_ERROR);
        return this.updateOrderStatus(id, nextStatus);
    }
    
    static async cancelOrder(id, user_id) {
        const order = await this.getOrder(id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        if (order.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (order.status === ORDER_STATUS.CANCELLED) throw new Error(ERRORS.ORDER_ALREADY_CANCELLED);
        if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED].includes(order.status)) {
            throw new Error(ERRORS.ORDER_CANNOT_BE_CANCELLED);
        }
        return this.updateOrderStatus(id, ORDER_STATUS.CANCELLED);
    }
    
    static async markAsPaid(id) {
        return Order().update({paid: true}).where({id});
    }
    
    static async markAsDelivered(id) {
        return Order().update({delivery: true, status: ORDER_STATUS.DELIVERED}).where({id});
    }

    static async setCarrierDelivered(id) {
        // Carrier marked delivered; keep delivery=false until user confirms
        return Order().update({status: ORDER_STATUS.DELIVERED}).where({id});
    }

    static async confirmDeliveredByUser(id, user_id) {
        const order = await this.getOrder(id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        if (order.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (order.status !== ORDER_STATUS.DELIVERED) throw new Error(ERRORS.VALIDATION_ERROR);
        // Final confirmation flips the delivery flag
        return Order().update({delivery: true}).where({id});
    }
} 