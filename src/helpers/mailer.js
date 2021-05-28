require("dotenv").config();
const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT } = process.env;

class Mailer {
  #html = null;
  #title = null;
  #subject = null;
  #receiver = null;
  #sender = MAILER_USER;
  #transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASS,
    },
  });

  // Used for initializng all of the data that is going to be sent via email
  init(receiver, subject, title, HTML = ``) {
    this.#receiver = receiver;
    this.#subject = subject;
    this.#title = title;
    this.#html = HTML;
  }

  // Used for sending the email
  async send() {
    if (!this.#receiver || !this.#subject || !this.#title) {
      throw new Error(
        "You have either forgot to call the init() method on the mailer or have not specified a parameter"
      );
    } else {
      const transporter = this.#transporter;
      const info = await transporter.sendMail({
        from: `"noreply" <${this.#sender}>`,
        to: `${this.#receiver}`,
        subject: `${this.#subject}`,
        text: `${this.#title}`,
        html: this.#html,
      });
      return info;
    }
  }
}

module.exports = new Mailer();
