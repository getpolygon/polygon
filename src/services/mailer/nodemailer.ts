import {
  smtpHostNotSupplied,
  smtpPassNotSupplied,
  smtpPortNotSupplied,
  smtpUserNotSupplied,
  NodemailerSMTPConfigError,
} from "./errors";
import { isNil } from "lodash";
import config from "config/index";
import { compile } from "handlebars";
import { itOrError } from "lib/itOrError";
import { createTransport } from "nodemailer";
import { readTemplate } from "lib/readTemplate";
import { itOrDefaultTo } from "lib/itOrDefaultTo";

// prettier-ignore
// Initialization checks. These are used to ensure that the configuration is complete.
if (config.email?.client !== "courier" && (config.polygon?.emailEnableVerification === false || isNil(config.polygon?.emailEnableVerification))) {
  // If the email client is Nodemailer, then we need to make sure that the SMTP configuration is supplied.
  // It should not be partial.
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
 * Function for sending emails with Nodemailer.
 *
 * @param email - Recipient email address
 * @param data - Additional data to compile the template with
 * @param templateName - Template name or path without `.hbs` extension
 */
export const send = async (email: string, templateName: string, data = {}) => {
  const template = readTemplate(templateName);
  const html = compile(template)(data);

  const response = await nodemailer.sendMail({
    html,
    to: email,
    from: config.smtp?.user,
  });

  return response;
};
