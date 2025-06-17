const express = require('express');
const passport = require('passport');
const userModel = require('../models/user.model');
const { signUpUser } = require('../services/auth.service');
const jwt=require('jsonwebtoken');
const router = express.Router();

// Auth route to start login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route after Google login
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  async (req, res) => {
    const email = req.user.emails[0].value;
    const user = await userModel.findOne({ email });

    if (!user) {
      const { user: newUser, token } = await signUpUser({
        userId: email.slice(0, email.indexOf('@')),
        email,
        password: '*w?/+`.@$,'
      });
      res.redirect(`https://chat-application-henna-iota.vercel.app/login?token=${token}`);
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.redirect(`https://chat-application-henna-iota.vercel.app/login?token=${token}`);
    }
  }
);

// Success and Failure routes
router.get('/success', (req, res) => {

  res.send(`Welcome ${req.user.displayName}!`,req.user);
});

router.get('/failure', (req, res) => {
  res.send('Failed to login via Google.');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
