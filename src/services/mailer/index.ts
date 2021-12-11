import { isEqual } from "lodash";
import config from "config/index";
import { send as CourierSend } from "./courier";
import { send as NodemailerSend } from "./nodemailer";

export const send = async (email: string, template: string, data?: object) => {
  if (isEqual(config.polygon?.emailEnableVerification, true)) {
    if (isEqual(config.email?.client, "courier")) {
      const response = await CourierSend(email, template, data);
      return response;
    } else {
      const response = await NodemailerSend(email, template, data);
      return response;
    }
  } else {
    throw new Error(
      "`polygon.emailEnableVerification` is not enabled in `config.yaml`. Cannot use the mailer."
    );
  }
};
