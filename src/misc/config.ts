import fs from "fs";
import yaml from "yaml";
import path from "path";
import env from "env-var";
import { format } from "util";
import { isNil } from "lodash";
import { z, ZodError } from "zod";
import { isUri } from "@lib/isUri";
import { EventEmitter } from "events";
import { YAMLError } from "yaml/util";
import { Logger } from "@util/logger";
import Container, { Service } from "typedi";

class UninitializedConfigError extends Error {
  constructor() {
    super();
    super.name = "UninitializedConfigError";
    super.message = "`Config` should be initialized before use.";
  }
}

/**
 * The schema for validating the configuration
 * file for Polygon. This will handle the validation
 * of the configuration file.
 *
 * - If the configuration file is not valid,
 * an error will be thrown.
 *
 * - If the configuration file is valid, the configuration
 * will be loaded into the application.
 */
const CONFIG_SCHEMA = z
  .object({
    polygon: z.object({
      port: z.number().default(3001),
      frontend: z.string().min(1).url(),
      templates: z
        .optional(
          z.object({
            path: z.optional(z.string()).default("templates/"),
          })
        )
        .default({}),
      origins: z.optional(z.array(z.string())).default([]),
    }),

    jwt: z.object({
      secret: z.string(),
      issuer: z.string().default("@polygon-isecure/core"),
      audience: z
        .array(z.string())
        .default(["@polygon-isecure/polygon", "@polygon-isecure/next"]),
    }),

    email: z
      .object({
        enableVerification: z.optional(z.boolean()).default(false),
        expireVerification: z.optional(z.number()).default(60 * 5),
        client: z
          .optional(z.enum(["courier", "nodemailer", "none"]))
          .default("none"),
      })
      .superRefine((v, c) => {
        const caseOne = v.client !== "none" && !v.enableVerification;
        if (caseOne) {
          const message =
            "`email.enableVerification` should be `true` when `email.client` is not `none`";

          c.addIssue({
            message,
            fatal: true,
            code: z.ZodIssueCode.custom,
            path: ["enableVerification"],
          });
        }

        const caseTwo = v.client === "none" && v.enableVerification;
        if (caseTwo) {
          const message =
            "`email.enableVerification` should be `false` when `email.client` is `none`";

          c.addIssue({
            message,
            fatal: true,
            code: z.ZodIssueCode.custom,
            path: ["enableVerification"],
          });
        }
      })
      .default({}),

    databases: z
      .object({
        redis: z.string(),
        stormi: z.string(),
        postgres: z.string(),
      })
      .superRefine((v, c) => {
        const message = "%s connection string should be a valid URI";

        if (!isUri(v.redis)) {
          c.addIssue({
            fatal: true,
            path: ["redis"],
            code: z.ZodIssueCode.custom,
            message: format(message, "Redis"),
          });
        }

        if (!isUri(v.postgres)) {
          c.addIssue({
            fatal: true,
            path: ["postgres"],
            code: z.ZodIssueCode.custom,
            message: format(message, "PostgreSQL"),
          });
        }

        if (!isUri(v.stormi)) {
          c.addIssue({
            fatal: true,
            path: ["stormi"],
            code: z.ZodIssueCode.custom,
            message: format(message, "Stormi"),
          });
        }
      }),

    smtp: z
      .object({
        host: z.optional(z.string()).nullable().default(null),
        port: z.optional(z.number()).nullable().default(null),
        user: z.optional(z.string()).nullable().default(null),
        pass: z.optional(z.string()).nullable().default(null),
        secure: z.optional(z.boolean()).default(true),
      })
      .default({}),

    courier: z
      .optional(
        z.object({
          token: z.optional(z.string()).nullable().default(null),
          brand: z.optional(z.string()).nullable().default(null),
          events: z
            .optional(
              z.object({
                verification: z.string().nullable().default(null),
              })
            )
            .nullable()
            .default(null),
        })
      )
      .default({}),
  })
  .superRefine((v, c) => {
    /**
     * If email verification is enabled, with a selected
     * email client we will need to validate the `smtp`
     * configuration in order to not cause errors and
     * undefined behavior at runtime.
     */
    if (v.email.enableVerification && v.email.client !== "none") {
      Object.entries(v.smtp).map(([__k, __v]) => {
        if (isNil(__v)) {
          c.addIssue({
            fatal: true,
            path: ["smtp", __k],
            code: z.ZodIssueCode.custom,
            message: `To use \`${v.email.client}\` as an email client, \`smtp.${__k}\` should not be empty`,
          });
        }
      });
    }

    /**
     * If the selected email client is courier we will
     * need to check if all the required properties of
     * the optional `courier` object are present. If they
     * are not, zod will throw an error.
     */
    if (v.email.client === "courier") {
      Object.entries(v.courier).map(([__k, __v]) => {
        if (isNil(__v)) {
          c.addIssue({
            fatal: true,
            path: ["courier", __k],
            code: z.ZodIssueCode.custom,
            message: `To use \`courier\` as an email client, property \`courier.${__k}\` should be defined in the configuration file`,
          });
        }
      });
    }
  });

/**
 * `zod` will automatically infer the type of the
 * configuration schema. This type will be used
 * in the `Config` class.
 */
type ConfigType = z.infer<typeof CONFIG_SCHEMA>;

/**
 * Node environment configuration
 */
type NodeEnv = "production" | "test" | "development";

@Service()
class Config {
  /**
   * Internal state of parsed configuration
   */
  private internal: ConfigType;
  /**
   * Indicates whether the configuration has been
   * initialized or not.
   */
  public initialized: boolean;
  /**
   * The configuration file path for Polygon
   */
  private readonly configPath: string;
  /**
   * This emitter will be used for logging configuration
   * updates. Will only be initialized if `NODE_ENV` is
   * not equal to `test`.
   */
  private emitter: EventEmitter | undefined;
  private readonly nodeEnv: NodeEnv;

  constructor(private readonly logger: Logger) {
    this.initialized = false;
    this.internal = {} as unknown as ConfigType;
    this.nodeEnv = process.env.NODE_ENV as unknown as NodeEnv;
    this.configPath = path.resolve(
      env
        .get("POLYGON.CONFIG.PATH")
        .required()
        .default("./config.yaml")
        .asString()
    );

    /**
     * EventEmitter will only be initialized if `NODE_ENV`
     * is not equal to `test`. Here we will initialize the
     * EventEmitter and register the `loadStart` and `loadEnd`
     * events.
     */
    if (this.nodeEnv !== "test") {
      // Only initializing the EventEmitter when NODE_ENV is not equal to `test`.
      this.emitter = new EventEmitter();
      this.emitter.on("loadStart", () =>
        this.logger.info("Loading configuration...")
      );

      this.emitter.on("loadEnd", () => {
        /**
         * For development purposes we are going to enable
         * configuration logging by default, so that it is
         * easier to find configuration validation errors.
         */
        if (this.nodeEnv === "development") {
          this.logger.debug(
            "config/index.ts:147 <class Config> :",
            this.internal
          );
        }

        this.logger.info("Configuration loaded successfully");
      });

      this.emitter.on("error", (error: Error) => {
        // Something wrong with YAML syntax
        if (error instanceof YAMLError)
          this.logger.error("Invalid YAML configuration error");
        // Something wrong with validating the JSON with Zod
        else if (error instanceof ZodError) {
          this.logger.error("Invalid configuration error");
        }
        // Undefined behavior
        else {
          this.logger.error(
            "There was an error while loading the configuration"
          );
        }

        this.logger.error(error.message);
        process.exit(1);
      });
    }
  }

  /**
   * This method will attempt to get the internal
   * parsed and validated state of the configuration.
   * If the configuration is not initialized, this will
   * throw an error.
   */
  public get(): ConfigType {
    if (this.initialized) return this.internal;
    else throw new UninitializedConfigError();
  }

  /**
   * This method will attempt to read, parse and validate
   * provided YAML configuration if it is not initialized.
   * Calling this method for the second time will not change
   * anything.
   */
  public init() {
    if (!this.initialized) {
      try {
        // Indicate that the configuration has started to load
        this.emitter?.emit("loadStart");

        const file = fs.readFileSync(this.configPath).toString();
        const parsed = yaml.parse(file, { prettyErrors: true });
        const internal = CONFIG_SCHEMA.parse(parsed);

        this.initialized = true;
        this.internal = internal;

        // Indicate that the configuration has been loaded successfully
        this.emitter?.emit("loadEnd");
      } catch (error) {
        /**
         * Handling the error manually and exiting
         * the process in the end.
         */
        this.emitter?.emit("error", error);
      }
    }

    return this;
  }
}

export default Container.get(Config).init().get();
