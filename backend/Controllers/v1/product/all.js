const { object, number, string, boolean } = require("yup");
const {CATEGORY, ERRORS} = require("../../utils/enums");
const Product = require("../../../Classes/Product");

const schema = object({
    category: string().oneOf([...Object.values(CATEGORY), "all"]).required(),
    discount: boolean(),
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
    order: object({
        column: string()
            .oneOf(["rating", "sell_count", "id", "price", "name"])
            .required(),
        direction: string().oneOf(["asc", "desc"]).required(),
    }).required(),
    user_id: number().min(1).max(1000000000),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { category, discount, offset, limit, order, user_id } = req.body;
        const {data , count} = user_id
            ? await Product.getUserProducts(user_id, offset, limit, order.column, order.direction, category, discount)
            : await Product.getProducts(offset, limit, order.column, order.direction, category, discount);
        res.status(200).send({
            statusCode: 200,
            data,
            count,
            message: "success",
        });
    } catch (e) {
        next(e);
    }
};
