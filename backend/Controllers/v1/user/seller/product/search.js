const { object, number, string, boolean } = require("yup");
const {CATEGORY, ERRORS} = require("../../../../utils/enums");
const Product = require("../../../../../Classes/Product");

const schema = object({
    category: string().oneOf([...Object.values(CATEGORY), "all"]).required(),
    in_stock: boolean(),
    discount: object({
        min: number().min(0).max(100),
        max: number().min(0).max(100),
    }),
    price: object({
        min: number().min(0).max(1000000000),
        max: number().min(0).max(1000000000),
    }),
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
    order: object({
        column: string()
            .oneOf(["rating", "sell_count", "id", "price", "name"])
            .required(),
        direction: string().oneOf(["asc", "desc"]).required(),
    }).required(),
    term: string().min(3),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.validate(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { category, discount, price, offset, limit, order, term, in_stock } = req.body;
        const {data , count} = await Product.filterUserProducts(req.user.id, offset, limit, order.column, order.direction, category, discount, price, term, in_stock);
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
