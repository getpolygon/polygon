// const nodePin = require("node-pin");
// const showdown = require("showdown");
import nodemailer from "nodemailer";
const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT } = process.env;

// Creating a reusable transport
const mailer = nodemailer.createTransport({
  host: MAILER_HOST!!,
  port: parseInt(MAILER_PORT!!),
  secure: false,
  auth: {
    user: MAILER_USER!!,
    pass: MAILER_PASS!!,
  },
});

const send = async (
  receiver: string,
  subject: string,
  title: string,
  html: string
) => {
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
