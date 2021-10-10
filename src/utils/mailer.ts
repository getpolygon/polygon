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

interface MailProps {
  html: string;
  subject: string;
  receiver: string;
}

export class Mail {
  private html: string;
  private subject: string;
  private receiver: string;

  constructor({ receiver, subject, html }: MailProps) {
    this.html = html;
    this.subject = subject;
    this.receiver = receiver;
  }

  async send() {
    if (!this.receiver) throw new Error("Receiver not specified");
    else {
      try {
        const response = await mailer.sendMail({
          html: this.html,
          to: this.receiver,
          subject: this.subject,
        });

        return response;
      } catch (error) {}
    }
  }
}
