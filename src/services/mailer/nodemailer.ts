import config from "config/index";
import { compile } from "handlebars";
import { isEqual, isNil } from "lodash";
import { createTransport } from "nodemailer";
import { readTemplate } from "lib/readTemplate";
import { NodemailerSMTPConfigError } from "./errors";

// Initialization checks
// prettier-ignore
if (!isEqual(config.email?.client, "courier") && (isEqual(config.polygon?.emailEnableVerification, false) || isNil(config.polygon?.emailEnableVerification))) {
  if (isNil(config.smtp)) throw new NodemailerSMTPConfigError();
}

const nodemailer = createTransport({
  auth: {
    user: config.smtp?.user,
    pass: config.smtp?.pass,
  },
  host: config.smtp?.host,
  port: config.smtp?.port,
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
  const response = await nodemailer.sendMail({
    html,
    to: email,
    from: config.smtp?.user
  });

  return response;
};
