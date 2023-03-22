const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sofia.paucek@ethereal.email',
        pass: 'VUa1cpBfZ1vxf4BYu6'
    }
  });

  // 2) define email options
  const mailInfo = {
    from: `mustafa dabah<hello@dabah.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) actually send the email
  await transporter.sendMail(mailInfo);
};

module.exports = sendEmail;
