module.exports = async (req, res, next) => {
    try {
        const data = {id: req.user.id, email: req.user.email, user: req.user.type, first_name: req.user.first_name, last_name: req.user.last_name, profile_pic: req.user.profile_pic, verified: req.user.verified}
        res.status(200).send({
            statusCode: 200,
            data,
            message: "Success",
        });
    } catch (e) {
        res.clearCookie("Authorization");
        res.removeHeader("Authorization");
        next(e);
    }
}