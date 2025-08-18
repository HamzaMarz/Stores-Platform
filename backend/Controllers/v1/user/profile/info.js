const User = require("../../../../Classes/User");

module.exports = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user.id);
        res.status(200).send({
            statusCode: 200,
            data: {
                first_name: user?.first_name || null,
                last_name: user?.last_name || null,
                phone: user?.phone || null,
                bank_name: user?.bank_name || null,
                bank_account: user?.bank_account || null,
            },
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}


