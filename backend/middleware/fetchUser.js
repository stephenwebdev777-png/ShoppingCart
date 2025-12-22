const jwt = require("jsonwebtoken");
const Blacklist = require("../model/Blacklist");

const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).send({ errors: "Please authenticate" });
    }
    try {
        const isBlacklisted = await Blacklist.findOne({ token: token });
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                errors: "Token blacklisted",
                forceLogout: true
            });
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Invalid Token" });
    }
};

module.exports = fetchUser;
