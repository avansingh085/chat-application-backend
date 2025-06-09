const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
 console.log(profile)
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user); // Save the whole profile in session
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

