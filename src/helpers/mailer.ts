import nodemailer from "nodemailer";
const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT, NODE_ENV } =
  process.env;
const __DEV__ = NODE_ENV === "development";

// Creating a reusable transport
const mailer = nodemailer.createTransport({
  host: MAILER_HOST!!,
  port: JSON.parse(MAILER_PORT!!),
  secure: __DEV__ ? false : true,
  auth: {
    user: MAILER_USER!!,
    pass: MAILER_PASS!!,
  },
});

interface MailerInterface {
  html: string;
  subject: string;
  receiver: string;
}

const send = async ({ receiver, subject, html }: MailerInterface) => {
  if (!receiver) throw new Error("Receiver not specified");
  else {
    const data = await mailer.sendMail({
      html: html,
      to: receiver,
      subject: subject,
      from: MAILER_USER!!,
    });

    return data;
  }
};

export { send };
