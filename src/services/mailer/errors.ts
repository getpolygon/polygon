import { PartialConfigError } from "lib/PartialConfigError";

export class CourierTokenError extends Error {
  constructor() {
    super(
      "`courier.token` was not supplied in `config.yaml`. Using Courier as default mailer requires a Courier account. Learn more at https://www.courier.com/"
    );
  }
}

export class NodemailerSMTPConfigError extends Error {
  constructor() {
    super(
      "`smtp` configuration was not supplied in `config.yaml`. Usage with Nodemailer requires SMTP credentials"
    );
  }
}

export const smtpUserNotSupplied = new PartialConfigError("`smtp.user`");
export const smtpHostNotSupplied = new PartialConfigError("`smtp.host`");
export const smtpPassNotSupplied = new PartialConfigError("`smtp.pass`");
export const smtpPortNotSupplied = new PartialConfigError("`smtp.port`");
