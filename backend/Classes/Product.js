const {Product, knex} = require("../Database/models");
const {uploadFiles, uploadFilesArray} = require("../Controllers/utils/upload-file");
const Helper = require("../Controllers/utils/Helper");
const {ERRORS} = require("../Controllers/utils/enums");

module.exports = class {
     static productOwnerQuery = knex
        .select(knex.raw("json_build_object('store_name', \"store\".\"store_name\", 'merchant_alias', \"merchant\".\"alias\")"))
        .from("user")
        .join("store", function () {
            this.on("user.id", "=", "store.user_id")
        })
        .join("merchant", function () {
            this.on("user.id", "=", "merchant.user_id")
        })
        .whereRaw('\"user\".\"id\" = \"product\".\"user_id\"')
        .as("product_owner");

    static async getProduct(id) {
        return Product().select("*" , this.productOwnerQuery).where({id}).first();
    }
    static async getProducts(offset, limit, orderBy, order, category, discount = false) {
        const query = Product().where({unlisted: false}).select("id", this.productOwnerQuery, "name", "price", "discount", "rating", "sell_count", "rating_count", "category", "thumbnail_image", "description", "images", "in_stock", "user_id as owner_id")
        if(category !== "all") query.andWhere({category});
        if(discount) query.whereNot({discount: 0});
        const countRow = await query.clone().clearSelect().clearOrder().count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        return {count, data: await query.offset(offset).limit(limit).orderBy(orderBy, order)};
    }
    static async getUserProducts(user_id, offset, limit, orderBy, order, category, discount = false) {
        const query = Product().where({unlisted: false, user_id}).select("id", this.productOwnerQuery, "name", "price", "discount", "rating", "sell_count", "rating_count", "category", "thumbnail_image", "description", "images", "in_stock", "user_id as owner_id")
        if(category !== "all") query.andWhere({category});
        if(discount) query.whereNot({discount: 0});
        const countRow = await query.clone().clearSelect().clearOrder().count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        return {count, data: await query.offset(offset).limit(limit).orderBy(orderBy, order)};
    }
    static async getUserUnlistedProducts(user_id, offset, limit, orderBy, order, category, discount = false) {
        const query = Product().where({unlisted: true, user_id}).select("id", this.productOwnerQuery, "name", "price", "discount", "rating", "sell_count", "rating_count", "category", "thumbnail_image", "description", "images", "in_stock", "user_id as owner_id")
        if(category !== "all") query.andWhere({category});
        if(discount) query.whereNot({discount: 0});
        const countRow = await query.clone().clearSelect().clearOrder().count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        return {count, data: await query.offset(offset).limit(limit).orderBy(orderBy, order)};
    }

    static async filterProducts(offset, limit, orderBy, order, category, discount, price, term, in_stock) {
        const query = Product().where({unlisted: false}).select("id", this.productOwnerQuery, "name", "price", "discount", "rating", "sell_count", "rating_count", "category", "thumbnail_image", "description", "images", "in_stock", "user_id as owner_id")
        if(category !== "all") query.andWhere({category});
        if(in_stock !== undefined) query.andWhere({in_stock});
        if(discount) query.andWhereBetween('discount', [discount.min, discount.max]);
        if(price) query.andWhereBetween('price', [price.min, price.max]);
        query.andWhereILike('name', `%${term}%`);
        const countRow = await query.clone().clearSelect().clearOrder().count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        return {count, data: await query.offset(offset).limit(limit).orderBy(orderBy, order)};
    }
    static async filterUserProducts(user_id, offset, limit, orderBy, order, category, discount, price, term, in_stock) {
        const query = Product().where({user_id}).select("id", this.productOwnerQuery, "name", "price", "discount", "rating", "sell_count", "rating_count", "category", "thumbnail_image", "description", "images", "in_stock", "user_id as owner_id")
        if(category !== "all") query.andWhere({category});
        if(in_stock !== undefined) query.andWhere({in_stock});
        if(discount) query.andWhereBetween('discount', [discount.min, discount.max]);
        if(price) query.andWhereBetween('price', [price.min, price.max]);
        if(term) query.andWhereILike('name', `%${term}%`);
        const countRow = await query.clone().clearSelect().clearOrder().count({count: 'id'}).first();
        const count = parseInt(countRow.count);
        return {count, data: await query.offset(offset).limit(limit).orderBy(orderBy, order)};
    }
    static async addNewProduct(user_id, name, description, thumbnailImage, images, category, price) {
        const [product] = await Product().insert({
            user_id,
            name,
            description,
            category,
            price,
        }).returning("id");
        const thumbnailImageUrl = await uploadFiles({img: thumbnailImage}, `products/user_${user_id}/product_${product.id}`);
        const imagesUrls = await uploadFilesArray(images, `products/user_${user_id}/product_${product.id}`);
        await Product().update({
            thumbnail_image: thumbnailImageUrl.img,
            images: JSON.stringify(imagesUrls),
        }).where({id: product.id});
        return product.id;
    }
    static async editProduct(product, name, description, thumbnail_image, images, category, price, discount, in_stock) {
        const editObj = {};
        if(name !== undefined) editObj.name = name;
        if(description !== undefined) editObj.description = description;
        if(category !== undefined) editObj.category = category;
        if(price !== undefined) editObj.price = price;
        if(discount !== undefined) editObj.discount = discount;
        if(in_stock !== undefined) editObj.in_stock = in_stock;
        if(thumbnail_image) {
            const thumbnailImageUrl = await uploadFiles({img: thumbnail_image}, `products/user_${product.user_id}/product_${product.id}`);
            editObj.thumbnail_image = thumbnailImageUrl.img;
            await Helper.removeFileByUrl(product.thumbnail_image);
        }
        if(images) {
            const imagesUrls = await uploadFilesArray(images, `products/user_${product.user_id}/product_${product.id}`);
            editObj.images = JSON.stringify(imagesUrls);
            const old_images = JSON.parse(product.images);
            for (const oldImage of old_images) {
                await Helper.removeFileByUrl(oldImage);
            }
        }
        return Product().update(editObj).where({id: product.id});
    }
    static async unlistProduct(id) {
        return Product().update({unlisted: true}).where({id});
    }
    static async enlistProduct(id) {
        return Product().update({unlisted: false}).where({id});
    }
    static async getCheckedProduct(id) {
        const product = await this.getProduct(id);
        if(!product || product.unlisted) throw new Error(ERRORS.PRODUCT_DOES_NOT_EXIST);
        if(!product.in_stock) throw new Error(ERRORS.PRODUCT_OUT_OF_STOCK);
        return product;
    }
}