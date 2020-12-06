const nodemailer = require("nodemailer");
const nodePin = require("node-pin");
const { host, email, password, secure, port } = require("../../config/email");

module.exports = async function main(receiver, subject, title) {
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
      html: nodePin.generateRandPin(4) // html body
    });

    return info;
  } catch (err) {
    console.error(err);
  }
};
