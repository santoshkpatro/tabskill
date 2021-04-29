const { User, Token } = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    existingUser = await User.findOne({ email: req.body.email }).exec();

    if (!existingUser) {
        const user = new User(req.body);
        try {
            user.setPassword(user.password);
            // user.isActive = false;
            await user.save();

            user.salt = undefined;
            user.password = undefined;
            user.tabCoins = undefined;
            user.roles = undefined;
            user.addresses = undefined;

            return res.status(201).json({
                message: "success",
                user: user,
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    return res.status(401).json({
        message: "User exist with this email",
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(400).json({
            message: "No user exists with this email",
        });
    }

    if (!user.validPassword(password)) {
        return res.status(400).json({
            message: "Password is incorrect",
        });
    }

    try {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: 30 * 24 * 60 * 60 * 60,
        });
        const authToken = new Token({ token: token });
        user.tokens.push(authToken);

        await user.save();

        return res.status(201).json({
            message: "success",
            token: authToken.token,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};
