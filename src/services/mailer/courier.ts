import {
  smtpHostNotSupplied,
  smtpPassNotSupplied,
  smtpPortNotSupplied,
  smtpUserNotSupplied,
} from "./errors";
import { isNil } from "lodash";
import config from "config/index";
import { itOrError } from "lib/itOrError";
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
    // Only overriding SMTP configuration if SMTP configuration was supplied
    override: !isNil(config.smtp)
      ? {
          smtp: {
            config: {
              auth: {
                user: itOrError(config.smtp?.user, smtpUserNotSupplied),
                pass: itOrError(config.smtp?.pass, smtpPassNotSupplied),
              },
              secure: config.smtp?.secure ?? true,
              host: itOrError(config.smtp?.host, smtpHostNotSupplied),
              port: itOrError(config.smtp?.port, smtpPortNotSupplied),
            },
          },
        }
      : {},
  });

  return response;
};
