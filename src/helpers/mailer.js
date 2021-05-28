require("dotenv").config();
// const nodePin = require("node-pin");
// const showdown = require("showdown");
const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_USER, MAILER_PASS, MAILER_PORT } = process.env;

class Mailer {
  #html = null;
  #title = null;
  #subject = null;
  #receiver = null;
  #transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: false,
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASS,
    },
  });

  // Used for initializng all of the data that is going to be sent via email
  init(receiver, subject, title) {
    // TODO: Add body
    this.#receiver = receiver;
    this.#subject = subject;
    this.#title = title;

    return this;
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
        to: `${this.#receiver}`,
        subject: `${this.#subject}`,
        text: `${this.#title}`,
        html: this.#html,
      });

      this.#receiver = null;
      this.#subject = null;
      this.#title = null;
      this.#html = null;

      return info;
    }
  }
}

module.exports = new Mailer();
