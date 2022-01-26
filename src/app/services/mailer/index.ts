import config from "@config";
import { Pair } from "@lib/Pair";
import { send as CourierSend } from "./courier";
import { send as NodemailerSend } from "./nodemailer";

/**
 * @param data - Data to send
 * @param email - Email address to send to
 * @param pair - The first value is the template name for Nodemailer. The second value is the event ID for Courier.
 */
export const send = async (
  email: string,
  pair: Pair<string, string>,
  data?: object
) => {
  // Check whether email verification is enabled
  if (config.email.enableVerification) {
    const response =
      config.email.client === "courier"
        ? await CourierSend(email, pair.getSecond(), data)
        : await NodemailerSend(email, pair.getFirst(), data);

    return response;
  }
};
