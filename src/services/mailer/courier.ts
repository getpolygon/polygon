import {
  CourierTokenError,
  smtpHostNotSupplied,
  smtpPassNotSupplied,
  smtpPortNotSupplied,
  smtpUserNotSupplied,
} from "./errors";
import config from "config/index";
import { isEqual, isNil } from "lodash";
import { itOrError } from "lib/itOrError";
import { itOrDefaultTo } from "lib/itOrDefaultTo";
import { CourierClient } from "@trycourier/courier";

// Initialization checks. These are used to ensure that the configuration is complete.
// prettier-ignore
if (isEqual(config.polygon?.emailEnableVerification, true) && isEqual(config.email?.client, "courier")) {
  // If the email client is Courier, then we need to make sure that the courier token is supplied.
  if (isNil(config.courier?.token)) throw new CourierTokenError();
}

// Initializing courier client
const courier = CourierClient({ authorizationToken: config.courier?.token });

/**
 * Sends an email using Courier. This is a wrapper around the Courier client.
 *
 * @param data - Data to send
 * @param eventId - Courier Event ID
 * @param email - Email address to send to
 */
export const send = async (email: string, eventId: string, data?: object) => {
  const response = await courier.send({
    data,
    eventId,
    // prettier-ignore
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
              secure: itOrDefaultTo(config.smtp?.secure, true),
              host: itOrError(config.smtp?.host, smtpHostNotSupplied),
              port: itOrError(config.smtp?.port, smtpPortNotSupplied),
            },
          },
        }
      : {},
  });

  return response;
};
