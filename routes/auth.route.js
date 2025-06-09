const express = require("express");
const router = express.Router();
const { login, signUp, logout, checkToken } = require("../controllers/auth.controller");

// Public Routes
router.post("/login", login);
router.post("/signup", signUp);

// Protected Routes
router.post("/logout", logout);
router.post("/verify", checkToken, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.user });
});

module.exports = router;
