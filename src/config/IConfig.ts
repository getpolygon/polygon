/**
 * Database configuration
 */
interface IDatabaseConfig {
  redis: string;
  postgres: string;
}

interface IPolygonConfig {
  /**
   * Frontend URL
   */
  frontendUrl: string;
  /**
   * Email verification token expiration time
   */
  emailExpireVerification: number;
  /**
   * Enable email verification
   */
  emailEnableVerification: boolean;
}

const enum EmailClient {
  Courier = "courier",
  Nodemailer = "nodemailer",
}

/**
 * JWT Configuration
 */
interface IJwtConfig {
  /**
   * JWT secret
   */
  secret: string;
  /**
   * Refresh token secret
   */
  refresh: string;
}

/**
 * Polygon SMTP configuration
 */
interface ISmtpConfig {
  /**
   * SMTP User
   */
  user: string;
  /**
   * SMTP password
   */
  pass: string;
  /**
   * SMTP host
   */
  host: string;
  /**
   * SMTP port
   */
  port: number;
  /**
   * Defines if the connection should use SSL (if true) or not (if false)
   */
  secure: boolean;
}

/**
 * Email configuration
 */
interface IEmailConfig {
  /**
   * Default email client
   */
  client: EmailClient | null;
}

/**
 * Courier configuration
 */
interface ICourierConfig {
  /**
   * Courier API token
   */
  token: string;
  /**
   * Courier brand ID
   */
  brandId: string;
  /**
   * Courier events
   */
  events: {
    /**
     * Email verification event
     */
    VERIFICATION: string;
  };
}

/**
 * Polygon configuration loaded from `config.yaml`
 */
export interface IConfig {
  jwt: IJwtConfig;
  smtp?: ISmtpConfig;
  email?: IEmailConfig;
  polygon?: IPolygonConfig;
  courier?: ICourierConfig;
  databases: IDatabaseConfig;
}
