const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  console.log(options);
  const transposter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email opions
  const emailOptions = {
    from: "E-Commerce<ecommerce@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Active and send Email
  await transposter.sendMail(emailOptions);
};

module.exports = sendEmail;
