const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('dotenv').config();

const authsRoutes = require('./routes/google.auth.route');
require('./auth/google.auth');
const chatRoutes=require('./routes/chat.route');
const authRoutes=require('./routes/auth.route');
const userRoutes=require('./routes/user.route');
 const uploadRoutes=require('./routes/upload.route');
 const groupLinkRoutes=require('./routes/group.route');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:[
      'https://chat-application-henna-iota.vercel.app',
      'https://www.avansingh.in'
    ],
  credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/upload',uploadRoutes)
app.use('/api/group',groupLinkRoutes);
app.use(session({
  secret: "mySuperSecretKey123",
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authsRoutes);

app.get('/', (req, res) => {
  res.send(`<a href="/auth/google">Login with Google</a>`);
});



module.exports = app;
