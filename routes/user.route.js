const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { checkToken } = require("../controllers/auth.controller");

router.get("/get", checkToken,userController.getUser);
router.post("/update-profile", userController.updateProfile);

module.exports = router;
