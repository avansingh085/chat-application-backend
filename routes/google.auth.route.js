const express = require('express');
const passport = require('passport');

const router = express.Router();

// Auth route to start login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback route after Google login
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // Successful login
    res.redirect('/auth/success');
  }
);

// Success and Failure routes
router.get('/success', (req, res) => {
  res.send(`Welcome ${req.user.displayName}!`);
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
