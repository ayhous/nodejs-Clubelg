// eslint-disable-next-line import/no-extraneous-dependencies
const nodeMailer = require("nodemailer");

const sendEmail = async (options , message) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    debug: true,
    logger: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOpts = {
    from: `${process.env.nameClub} - Sports <kado@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  console.log(mailOpts);
  console.log(transporter);

  await transporter.sendMail(mailOpts , () => message);
};

module.exports = sendEmail;
