const mongoose = require("mongoose");
const crypto = require("crypto");

const addressSchema = new mongoose.Schema(
    {
        addressType: {
            type: String,
            enum: ["Permanent", "Temporary", "Other"],
            default: "Other",
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
        },
        landmark: {
            type: String,
        },
    },
    { timestamps: true }
);

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        middleName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        phoneNumber: {
            type: String,
            required: false,
        },
        addresses: [addressSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
        tabCoins: {
            type: Number,
            default: 0,
        },
        roles: {
            type: Array,
            default: [0],
        },
        tokens: [tokenSchema],
    },
    { timestamps: true }
);

userSchema.methods.setPassword = function (enteredPassword) {
    this.salt = crypto.randomBytes(16).toString("hex");

    this.password = crypto
        .pbkdf2Sync(enteredPassword, this.salt, 1000, 64, "sha512")
        .toString("hex");
};

userSchema.methods.validPassword = function (enteredPassword) {
    var hashedPassword = crypto
        .pbkdf2Sync(enteredPassword, this.salt, 1000, 64, "sha512")
        .toString("hex");

    return this.password === hashedPassword;
};

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);

module.exports = {
    User,
    Token,
};
