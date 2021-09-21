import nodemailer from "nodemailer";

const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT, NODE_ENV } =
  process.env;
const isDev = NODE_ENV === "development";

console.log(MAILER_PORT, MAILER_USER, MAILER_PASS, MAILER_HOST);

// Creating a mail transport
const mailer = nodemailer.createTransport({
  host: MAILER_HOST!!,
  port: JSON.parse(MAILER_PORT!!),
  secure: isDev ? false : true,
  auth: {
    user: MAILER_USER!!,
    pass: MAILER_PASS!!,
  },
});

interface MailerProps {
  html: string;
  subject: string;
  receiver: string;
}

export const send = async ({ receiver, subject, html }: MailerProps) => {
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
