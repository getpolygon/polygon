import config from "config/index";
import { isEqual, isNil } from "lodash";
import { itOrError } from "lib/itOrError";
import { CourierClient } from "@trycourier/courier";
// prettier-ignore
import {  CourierTokenError, smtpHostNotSupplied, smtpPassNotSupplied, smtpPortNotSupplied, smtpUserNotSupplied } from "./errors";

// Initialization checks
// prettier-ignore
if (isEqual(config.polygon?.emailEnableVerification, true) && isEqual(config.email?.client, "courier")) {
  if (isNil(config.courier?.token)) throw new CourierTokenError();
}

// Initializing courier client
const courier = CourierClient({ authorizationToken: config.courier?.token });

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
            secure: true,
            host: itOrError(config.smtp?.host, smtpHostNotSupplied),
            port: itOrError(config.smtp?.port, smtpPortNotSupplied),
          },
        },
      }
      : {},
  });

  return response;
};
