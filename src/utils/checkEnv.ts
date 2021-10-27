import chalk from "chalk";
import logger from "./Logger";

const {
  PORT,
  ORIGINS,
  NODE_ENV,
  REDIS_URL,
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASS,
  SMTP_PORT,
  DATABASE_URL,
  COOKIE_SECRET,
  JWT_PRIVATE_KEY,
} = process.env;

// Dev env
const isDev = NODE_ENV === "development";

// Simple function for composing a warning message
const envVarMissing = (v: string) =>
  `Environment variable ${chalk.bold(chalk.underline(v))} was not specified`;

// For getting the name of a variable as a string
const nameOf = (v: object) => Object.keys(v)[0];

// Function for checking the presence of required environment variables
const checkEnv = () => {
  if (!REDIS_URL) logger.warn(envVarMissing(nameOf({ REDIS_URL })));
  if (!PORT && !isDev) logger.warn(envVarMissing(nameOf({ PORT })));
  if (!SMTP_HOST) logger.warn(envVarMissing(nameOf({ SMTP_HOST })));
  if (!SMTP_USER) logger.warn(envVarMissing(nameOf({ SMTP_USER })));
  if (!SMTP_PASS) logger.warn(envVarMissing(nameOf({ SMTP_PASS })));
  if (!SMTP_PORT) logger.warn(envVarMissing(nameOf({ SMTP_PORT })));
  if (!DATABASE_URL) logger.warn(envVarMissing(nameOf({ DATABASE_URL })));
  if (!ORIGINS && !isDev) logger.warn(envVarMissing(nameOf({ ORIGINS })));
  if (!COOKIE_SECRET) logger.warn(envVarMissing(nameOf({ COOKIE_SECRET })));
  if (!JWT_PRIVATE_KEY) logger.warn(envVarMissing(nameOf({ JWT_PRIVATE_KEY })));
};

export default checkEnv;
