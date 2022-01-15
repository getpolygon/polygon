import config from "@config";
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
    const response =
      config.email.client === "courier"
        ? await CourierSend(email, template, data)
        : await NodemailerSend(email, template, data);

    return response;
  }
};
