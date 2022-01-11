import config from "config";
import { send as CourierSend } from "./courier";
import { send as NodemailerSend } from "./nodemailer";

/**
 * @param data - Data to send
 * @param template - Template to send
 * @param email - Email address to send to
 */
export const send = async (email: string, template: string, data?: object) => {
  // Check whether email verification is enabled
  if (config.email.enableVerification) {
    // Default client is set to Courier
    if (config.email.client === "courier") {
      const response = await CourierSend(email, template, data);
      return response;
    } else {
      const response = await NodemailerSend(email, template, data);
      return response;
    }
  }
};
