const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/auth");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, (req, res) => {
    return res.send(req.user);
});

router.get("/me/admin", isAuthenticated, isAdmin, (req, res) => {
    return res.send(req.user);
});

module.exports = router;
