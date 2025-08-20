const Product = require("../../../../../Classes/Product");
const { ERRORS, CATEGORY} = require("../../../../utils/enums");
const { object, number, string, array} = require("yup");
const Helper = require("../../../../utils/Helper");

const bodySchema = object({
    name: string().min(3).max(100).required(),
    description: string().min(10).max(2000).required(),
    category: string().oneOf(Object.values(CATEGORY)).required(),
    price: number().min(0).max(1000000000).required(),
});
const filesSchema = object({
    thumbnail_image: Helper.yupImgValidation.required(),
    images: array().of(Helper.yupImgValidation.required()),
});

module.exports = async (req, res, next) => {
    try {
        const bodyValid = await bodySchema.isValid(req['body']);
        const filesValid = await filesSchema.isValid(req['files']);
        if (!bodyValid || !filesValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { name, description, category, price } = req.body;
        const { thumbnail_image } = req.files;
        const images = Array.isArray(req.files.images) ? req.files.images : (req.files.images ? [req.files.images] : []);
        await Product.addNewProduct(req.user.id, name, description, thumbnail_image, images, category, price);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};