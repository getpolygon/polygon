// TODO: Refactor

import fs from "fs";
import yaml from "yaml";

export const enum EmailClient {
  Courier = "courier",
  Nodemailer = "nodemailer",
}

export type Config = {
  jwt_secret: string;
  frontend_url: string;
  refresh_secret: string;

  email: {
    client: EmailClient | null;

    courier: {
      token: string;
      brandId: string;

      events: {
        welcome: string;
        verification: string;
      };
    };

    smtp: {
      port: number;
      pass: string;
      host: string;
      user: string;
    };
  };

  polygon: {
    email: {
      expire_verification: number;
      enable_verification: boolean;
    };
  };

  databases: {
    redis: string;
    postgres: string;
  };
};

const file = fs.readFileSync("config.yaml").toString();
const config: Partial<Config> = yaml.parse(file);
export default config;
