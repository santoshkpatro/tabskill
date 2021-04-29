const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.isAuthenticated = async (req, res, next) => {
    var token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(400).json({
            message: "Auth token not provided!!",
        });
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    if (!decoded) {
        return res.status(401).send("Token Not Valid");
    }

    const user = await User.findById(decoded).select(
        "-tokens -salt -password -addresses -isActive -tabCoins -createdAt -updatedAt -__v"
    );

    req.user = user;

    next();
};

exports.isAdmin = async (req, res, next) => {
    if (!req.user.roles.includes(3)) {
        return res.status(401).send("You are not authroized");
    }

    next();
};
