const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const checkToken  = require("../middlewares/verifyToken.js");

router.get("/get", checkToken,userController.getUser);
router.post("/update-profile",checkToken, userController.updateProfile);

module.exports = router;
