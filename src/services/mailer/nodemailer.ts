import config from "config/index";
import { compile } from "handlebars";
import { createTransport } from "nodemailer";
import { readTemplate } from "lib/readTemplate";

const isNodemailerAndEnabled =
  config.email?.client === "nodemailer" && config.email?.enableVerification;

// Creating a Nodemailer transport
const nodemailer = isNodemailerAndEnabled
  ? createTransport({
      auth: {
        user: config.smtp.user!,
        pass: config.smtp.pass!,
      },
      host: config.smtp.host!,
      port: config.smtp.port!,
      secure: config.smtp.secure,
    })
  : null;

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

  const response = await nodemailer?.sendMail({
    html,
    to: email,
    from: config.smtp.user!,
  });

  return response;
};
