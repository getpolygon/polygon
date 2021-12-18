import config from "config";
import { compile } from "handlebars";
import { isEqual, isNil } from "lodash";
import { itOrError } from "lib/itOrError";
import { createTransport } from "nodemailer";
import { readTemplate } from "lib/readTemplate";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
// prettier-ignore
import { NodemailerSMTPConfigError, smtpHostNotSupplied, smtpPassNotSupplied, smtpPortNotSupplied, smtpUserNotSupplied } from "./errors";

// prettier-ignore
if (!isEqual(config.email?.client, "courier") && (isEqual(config.polygon?.emailEnableVerification, false) || isNil(config.polygon?.emailEnableVerification))) {
  if (isNil(config.smtp)) throw new NodemailerSMTPConfigError();
}

// Creating a Nodemailer transport
const nodemailer = createTransport({
  auth: {
    user: itOrError(config.smtp?.user, smtpUserNotSupplied),
    pass: itOrError(config.smtp?.pass, smtpPassNotSupplied),
  },
  secure: itOrDefaultTo(config.smtp?.secure, true),
  host: itOrError(config.smtp?.host, smtpHostNotSupplied),
  port: itOrError(config.smtp?.port, smtpPortNotSupplied),
});

/**
 * Function for sending emails with Nodemailer
 *
 * @param email - Recipient email address
 * @param templateName - Template name or path without `.hbs` extension
 * @param data - Additional data to compile the template with
 */
// prettier-ignore
export const send = async (email: string, templateName: string, data?: object) => {
  const template = readTemplate(templateName);
  const html = compile(template)(data || {});
  // prettier-ignore
  const response = await nodemailer.sendMail({ html, to: email, from: config.smtp?.user });
  return response;
};
