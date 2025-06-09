const  nodemailer =require('nodemailer');
const { EMAIL_PASS, EMAIL_USER } =require('./server-config.js');

 const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

module.exports=transporter;

