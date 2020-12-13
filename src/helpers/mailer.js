const nodemailer = require("nodemailer");
// const nodePin = require("node-pin"); // For generating a random PIN
const { host, email, password, secure, port } = require("../../config/email");

module.exports = async function main(receiver, subject, title, html) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: email,
        pass: password
      }
    });

    let info = await transporter.sendMail({
      from: `"noreply" <${email}>`, // sender address
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
