const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Normally you would store user info in DB
  // Here we just return the profile
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user); // Save the whole profile in session
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
