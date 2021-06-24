require("dotenv").config();
// const nodePin = require("node-pin");
// const showdown = require("showdown");
const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT } = process.env;

// Creating a reusable transport
const mailer = nodemailer.createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  secure: false,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

/**
 * Function for sending emails
 *
 * @param {String} receiver
 * @param {String} subject
 * @param {String} title
 */
const send = async (receiver, subject, title, html) => {
  if (!receiver) throw new Error("Receiver not specified");
  else {
    const data = await mailer.sendMail({
      html: html,
      text: title,
      to: receiver,
      subject: subject,
    });

    return data;
  }
};

module.exports = { send };
