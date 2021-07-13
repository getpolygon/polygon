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

interface MailerInterface {
  html: string;
  subject?: string;
  receiver: string;
}

const send = async ({ receiver, subject, html }: MailerInterface) => {
  if (!receiver) throw new Error("Receiver not specified");
  else {
    const data = await mailer.sendMail({
      html: html,
      to: receiver,
      subject: subject,
    });

    return data;
  }
};

export { send };
