import config from "config/index";
import { CourierClient } from "@trycourier/courier";

const isCourierAndEnabled =
  config.email?.enableVerification === true &&
  config.email?.client === "courier";

// Initializing courier client
const courier = isCourierAndEnabled
  ? CourierClient({
      authorizationToken: config.courier?.token,
    })
  : null;

/**
 * Sends an email using Courier. This is a wrapper around the Courier client.
 *
 * @param data - Data to send
 * @param eventId - Courier Event ID
 * @param email - Email address to send to
 */
export const send = async (email: string, eventId: string, data?: object) => {
  const response = await courier?.send({
    data,
    eventId,
    profile: { email },
    recipientId: email,
    override: {
      smtp: {
        config: {
          auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
          },
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.secure,
        },
      },
    },
  });

  return response;
};
