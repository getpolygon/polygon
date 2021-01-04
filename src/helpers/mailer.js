const nodemailer = require("nodemailer");
// const nodePin = require("node-pin"); // For generating a random PIN
const { MAILER_host, MAILER_email, MAILER_password, MAILER_secure, MAILER_port } = process.env;

module.exports = async function main(receiver, subject, title, html) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: MAILER_host,
      port: parseInt(MAILER_port),
      secure: JSON.parse(MAILER_secure.toLowerCase()),
      auth: {
        user: MAILER_email,
        pass: MAILER_password
      }
    });

    let info = await transporter.sendMail({
      from: `"noreply" <${MAILER_email}>`, // sender address
      to: `${receiver}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `${title}`, // plain text body
      html: html // html body
    });

    return info;
  } catch (err) {
    console.error(err);
  }
};
