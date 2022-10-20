const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', //yahoo, hotmail etc
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //activate in gmail "less secure app" option
  });
  //2)define the email options
  //3)actually send the email
};
