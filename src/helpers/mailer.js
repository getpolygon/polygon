require("dotenv").config();
const nodemailer = require("nodemailer");
const { MAILER_HOST, MAILER_EMAIL, MAILER_PASS, MAILER_PORT } = process.env;

class Mailer {
  #transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: true,
    auth: {
      user: MAILER_EMAIL,
      pass: MAILER_PASS
    }
  });
  #sender = MAILER_EMAIL;
  #receiver = null;
  #subject = null;
  #title = null;
  #html = null;

  init(receiver, subject, title, HTML = ``) {
    this.#receiver = receiver;
    this.#subject = subject;
    this.#title = title;
    this.#html = HTML;
  }

  async sendMail() {
    try {
      if (this.receiver === null || this.subject === null || this.title === null) {
        throw new Error("You have forgot to call the init() method on the mailer");
      } else {
        const Transporter = this.#transporter;
        const Info = await Transporter.sendMail({
          from: `"noreply" <${this.#sender}>`,
          to: `${this.#receiver}`,
          subject: `${this.#subject}`,
          text: `${this.#title}`,
          html: this.#html
        });
        return Info;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

module.exports = new Mailer();
