import chalk from "chalk";
import Logger from "./Logger";

const {
  PORT,
  ORIGINS,
  NODE_ENV,
  REDIS_URL,
  MAILER_HOST,
  MAILER_USER,
  MAILER_PASS,
  MAILER_PORT,
  SALT_ROUNDS,
  DATABASE_URL,
  COOKIE_SECRET,
  JWT_PRIVATE_KEY,
  BASE_FRONTEND_URL,
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
  const logger = new Logger();

  if (!REDIS_URL) logger.warn(envVarMissing(nameOf({ REDIS_URL })));
  if (!PORT && !isDev) logger.warn(envVarMissing(nameOf({ PORT })));
  if (!MAILER_HOST) logger.warn(envVarMissing(nameOf({ MAILER_HOST })));
  if (!MAILER_PORT) logger.warn(envVarMissing(nameOf({ MAILER_PORT })));
  if (!MAILER_PASS) logger.warn(envVarMissing(nameOf({ MAILER_PASS })));
  if (!MAILER_USER) logger.warn(envVarMissing(nameOf({ MAILER_USER })));
  if (!SALT_ROUNDS) logger.warn(envVarMissing(nameOf({ SALT_ROUNDS })));
  if (!DATABASE_URL) logger.warn(envVarMissing(nameOf({ DATABASE_URL })));
  if (!ORIGINS && !isDev) logger.warn(envVarMissing(nameOf({ ORIGINS })));
  if (!COOKIE_SECRET) logger.warn(envVarMissing(nameOf({ COOKIE_SECRET })));
  if (!JWT_PRIVATE_KEY) logger.warn(envVarMissing(nameOf({ JWT_PRIVATE_KEY })));
  if (!BASE_FRONTEND_URL) logger.warn(envVarMissing(nameOf({ BASE_FRONTEND_URL })));
};

export default checkEnv;
