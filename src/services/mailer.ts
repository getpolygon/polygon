// TODO: Refactor

import fs from "fs";
import config from "config/index";
import handlebars from "handlebars";
import { createTransport } from "nodemailer";
import type { Transporter } from "nodemailer";
import { CourierClient } from "@trycourier/courier";
import type { ICourierClient } from "@trycourier/courier";
import { isEqual, isNil } from "lodash";

// Email templates
export const enum EmailTemplate {
  Verification = "verification.hbs",
}

// Courier configuration for Mailer
interface ICourierMailerConfig {
  eventId: string;
  brandId: string;
}

// Nodmailer configuration for Mailer
interface INodemailerMailerConfig {
  template: EmailTemplate;
}

/**
 * Configuration for `Mailer` class
 */
export interface IMailerConfig {
  data: object;
  recipient: string;
  courier: ICourierMailerConfig;
  nodemailer: INodemailerMailerConfig;
}

/**
 * Utility class for reading and rendering email templates
 */
class TemplateUtils {
  // For reading a template
  public static getTemplate(name: EmailTemplate): string {
    return fs.readFileSync(`templates/email/${name}`).toString();
  }

  // For rendering a template
  public static renderTemplate(tmpl: string, data: object): string {
    return handlebars.compile(tmpl)(data);
  }
}

/**
 * Utility class for sending emails with specified configuration
 */
class Mailer {
  private static nodemailer: Transporter | null;
  private static courier: ICourierClient | null;

  constructor() {
    /**
     * Only creating a nodemailer instance if
     * the specified transport is Courier
     */
    // prettier-ignore
    if (!isEqual(config.email?.client, "courier") && !isNil(config.email?.client)) {
      // Creating nodemailer transport with the supplied configuration
      const nodemailer = createTransport({
        auth: {
          user: config.smtp?.user,
          pass: config.smtp?.pass,
        },
        host: config.smtp?.host,
        port: config.smtp?.port,
      });

      // Setting nodemailer
      Mailer.nodemailer = nodemailer;
    } else {
      Mailer.courier = CourierClient({
        authorizationToken: config.courier?.token!!,
      });
    }
  }

  /**
   * Function for sending emails with the
   * specified client in the `config.yaml` file
   */
  public static async send(
    options: Partial<IMailerConfig>
  ): Promise<{ successful: boolean }> {
    if (isEqual(config.email?.client, "courier")) {
      try {
        await Mailer.courier?.send({
          profile: {
            email: options?.recipient!!,
          },
          // Appending optional data object for rendering the template
          data: options?.data,
          recipientId: options?.recipient!!,
          brand: options.courier?.brandId!!,
          eventId: options.courier?.eventId!!,
          override: {
            smtp: {
              config: {
                auth: {
                  user: config.smtp?.user,
                  pass: config.smtp?.pass,
                },
                host: config.smtp?.host,
                port: config.smtp?.port,
                secure: true,
              },
            },
          },
        });

        return { successful: true };
      } catch (error) {
        console.error(error);
        return { successful: false };
      }
    } else if (isEqual(config.email?.client, "nodemailer")) {
      try {
        // Rendering the template
        const template = TemplateUtils.renderTemplate(
          TemplateUtils.getTemplate(options.nodemailer?.template!!),
          options?.data!!
        );

        // Sending the email
        await Mailer.nodemailer?.sendMail({
          html: template,
          to: options.recipient,
          from: config.smtp?.user,
        });

        return { successful: true };
      } catch (error) {
        return { successful: false };
      }
    } else {
      /**
       * Throwing an error when an email client was not
       * specified but needed to be used from inside the code.
       * Purpose of throwing an error to add explicit handling when something like that happens. */
      throw new Error(
        "`email.client` from `config.yaml` was either `null` or not specified. Either add explicit code handling or do not use this service."
      );
    }
  }
}

export default Mailer;
