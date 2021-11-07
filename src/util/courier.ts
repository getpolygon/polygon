import { CourierClient } from "@trycourier/courier";

const defaultBrand = process.env.COURIER_BRAND;
const authorizationToken = process.env.COURIER_TOKEN;
const welcomeEventId = process.env.COURIER_WELCOME_EMAIL_EVENT_ID;
const verificationEventId = process.env.COURIER_VERIFICATION_EMAIL_EVENT_ID;

const courier = CourierClient({ authorizationToken });

// SMTP configuration for Courier
const smtp = {
  host: process.env.SMTP_HOST!!,
  user: process.env.SMTP_USER!!,
  pass: process.env.SMTP_PASS!!,
  port: Number(process.env.SMTP_PORT!!),
};

// Events defined at Courier console
const events = {
  welcomeEventId,
  verificationEventId,
};

// Brands defined at Courier console
const brands = {
  defaultBrand,
};

// Exposing the config
export const config = {
  smtp,
  events,
  brands,
  authorizationToken,
};

export default courier;
