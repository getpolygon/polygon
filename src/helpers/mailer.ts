import nodemailer from "nodemailer";

const { NODE_ENV, MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT } =
  process.env;

const isProd = NODE_ENV === "production";

const mailer = nodemailer.createTransport({
  secure: isProd,
  host: MAILER_HOST!!,
  port: JSON.parse(MAILER_PORT!!),
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

export const send = async ({ receiver: to, subject, html }: MailerProps) => {
  if (!to) throw new Error("Receiver not specified");
  else {
    try {
      const data = await mailer.sendMail({
        to,
        html,
        subject,
      });

      return data;
    } catch (error) {
      // Do nothing
    }
  }
};
