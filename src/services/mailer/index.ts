import { isNil } from "lodash";
import config from "config/index";
import { isUri } from "lib/isUri";
import { send as CourierSend } from "./courier";
import { send as NodemailerSend } from "./nodemailer";
import { PartialConfigError } from "lib/PartialConfigError";
import { InvalidConfigError } from "lib/InvalidConfigError";

/**
 * @param data - Data to send
 * @param template - Template to send
 * @param email - Email address to send to
 */
export const send = async (email: string, template: string, data?: object) => {
  // Check whether email verification is enabled
  if (config.email?.enableVerification === true) {
    // If email verification is enabled, then we need to make sure that the frontend URL is supplied.
    if (isNil(config.polygon?.frontendUrl)) {
      throw new PartialConfigError("`polygon.frontendUrl`");
    }
    // If the frontend URL is not a valid URL, then throw an error.
    else if (!isUri(config.polygon?.frontendUrl!)) {
      throw new InvalidConfigError("`polygon.frontendUrl`", "URL");
    } else {
      // Default client is set to Courier
      if (config.email?.client === "courier") {
        const response = await CourierSend(email, template, data);
        return response;
      } else {
        const response = await NodemailerSend(email, template, data);
        return response;
      }
    }
  }
  // If email verification is disabled, throw an error.
  else throw new PartialConfigError("`email.enableVerification`");
};
