const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { signUpUser } = require("../services/auth.service");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  async (req, res) => {
    try {

      const email = req.user.emails[0].value;

      let user = await userModel.findOne({ email });
      let token;

      if (!user) {
        const result = await signUpUser({
          userId: email.slice(0, email.indexOf("@")),
          email,
          password: "*"
        });

        user = result.user;
        token = result.token;

      } else {
       
        token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
      }

      
      res.cookie("ChatsToken", token, {
        httpOnly: true,
        secure: true,        
        sameSite: "none",   
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

     
      res.redirect("https://chat-application-henna-iota.vercel.app");

    } catch (error) {
      console.error(error);
      res.redirect("/auth/failure");
    }
  }
);


router.get("/success", (req, res) => {
  res.send(`Welcome ${req.user.displayName}!`);
});


router.get("/failure", (req, res) => {
  res.send("Failed to login via Google.");
});


router.get("/logout", (req, res) => {
  res.clearCookie("ChatsToken");

  req.logout(() => {
    res.redirect("/");
  });
});


module.exports = router;