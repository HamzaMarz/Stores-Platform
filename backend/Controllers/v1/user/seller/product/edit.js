const Product = require("../../../../../Classes/Product");
const { ERRORS, CATEGORY} = require("../../../../utils/enums");
const {object, string, array, number, boolean, mixed} = require("yup");
const Helper = require("../../../../utils/Helper");

const idSchema = object({
    id: number().min(1).max(1000000000).required(),
});
const bodyUpdatesSchema = object({
    name: string().min(3).max(100),
    description: string().min(10).max(2000),
    category: string().oneOf(Object.values(CATEGORY)),
    price: number().min(0).max(1000000000),
    discount: number().min(0).max(100),
    in_stock: boolean()
});
const filesSchema = object({
    thumbnail_image: Helper.yupImgValidation,
    images: mixed().test('images', 'images is not valid', (value) => {
        if (value === undefined) return true;
        const files = Array.isArray(value) ? value : [value];
        return files.every((f) => Helper.yupImgValidation.isValidSync(f));
    }),
});

module.exports = async (req, res, next) => {
    try {
        // id is required
        const idValid = await idSchema.isValid(req['body']);
        if (!idValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, name, description, category, price, discount, in_stock} = req.body;
        const thumbnail_image = req.files?.thumbnail_image;
        const images = Array.isArray(req.files?.images) ? req.files.images : (req.files?.images ? [req.files.images] : undefined);

        // Determine presence
        const hasBodyUpdates = [name, description, category, price, discount, in_stock].some(v => v !== undefined);
        const hasFilesUpdates = Boolean(thumbnail_image || images);
        if (!hasBodyUpdates && !hasFilesUpdates) throw new Error(ERRORS.VALIDATION_ERROR);

        if (hasBodyUpdates) {
            const bodyValid = await bodyUpdatesSchema.isValid({ name, description, category, price, discount, in_stock });
            if (!bodyValid) throw new Error(ERRORS.VALIDATION_ERROR);
        }
        if (hasFilesUpdates) {
            const filesValid = await filesSchema.isValid(req['files'] || {});
            if (!filesValid) throw new Error(ERRORS.VALIDATION_ERROR);
        }

        const product = await Product.getProduct(id);
        if( !product || product.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);

        await Product.editProduct(product, name, description, thumbnail_image, images, category, price, discount, in_stock);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};