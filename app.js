const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const startAutoDeleteJob=require('./jobs/autoDelete.job.js');
require('dotenv').config();
const {SESSION_SECRET} =require('./config/server.config.js');
const authsRoutes = require('./routes/google.auth.route');
require('./auth/google.auth');
const chatRoutes=require('./routes/chat.route');
const authRoutes=require('./routes/auth.route');
const userRoutes=require('./routes/user.route');
const uploadRoutes=require('./routes/upload.route');
const groupLinkRoutes=require('./routes/group.route');
const groupAutoDelete=require('./routes/groupAutoDelete.route.js');
const app = express();
startAutoDeleteJob();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:[
      'https://chat-application-henna-iota.vercel.app',
      'https://www.avansingh.in',
      'http://localhost:5173',
    ],
  credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/upload',uploadRoutes)
app.use('/api/group',groupLinkRoutes);
app.use('/api/group-auto-delete',groupAutoDelete);


app.use(session({
  secret: SESSION_SECRET,
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
