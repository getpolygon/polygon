import fs from "fs";
import yaml from "yaml";
import path from "path";
import env from "env-var";
import { z, ZodError } from "zod";
import { Logger } from "util/logger";
import { EventEmitter } from "events";
import { YAMLError } from "yaml/util";
import { isEmpty, isNil } from "lodash";
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
    session: z.object({
      secret: z.string().min(1),
    }),
    polygon: z
      .object({
        frontendUrl: z.optional(z.string().min(1).url()).default(""),
      })
      .default({}),

    jwt: z.object({
      secret: z.string(),
      refresh: z.string(),
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
        const caseTwo = v.client === "none" && v.enableVerification;

        if (caseOne) {
          const message =
            "`email.enableVerification` should be `true` when `email.client` is not `none`";

          c.addIssue({
            message,
            fatal: true,
            code: z.ZodIssueCode.custom,
            path: ["email", "enableVerification"],
          });
        }

        if (caseTwo) {
          const message =
            "`email.enableVerification` should be `false` when `email.client` is `none`";

          c.addIssue({
            message,
            fatal: true,
            code: z.ZodIssueCode.custom,
            path: ["email", "enableVerification"],
          });
        }
      }),

    databases: z.object({
      redis: z.string(),
      stormi: z.string(),
      postgres: z.string(),
    }),

    smtp: z
      .object({
        host: z.optional(z.string()).default(null as any),
        port: z.optional(z.number()).default(null as any),
        user: z.optional(z.string()).default(null as any),
        pass: z.optional(z.string()).default(null as any),
        secure: z.optional(z.boolean()).default(null as any),
      })
      .default({}),

    courier: z
      .object({
        token: z.optional(z.string()).default(""),
        brand: z.optional(z.string()).default(""),
        events: z
          .optional(
            z.object({
              verification: z.string().default(""),
            })
          )
          .default({}),
      })

      .default({}),
  })
  .superRefine((v, c) => {
    if (
      v.email.enableVerification &&
      v.email.client !== "none" &&
      v.polygon.frontendUrl === ""
    ) {
      c.addIssue({
        fatal: true,
        code: z.ZodIssueCode.custom,
        path: ["polygon", "frontendUrl"],
        message:
          "To use an email client, property `frontendUrl` should be defined in the configuration file",
      });
    }

    /**
     * If email verification is enabled, with a selected
     * email client but the SMTP configuration is empty
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

    if (v.email.client === "courier" && isEmpty(v.courier)) {
      c.addIssue({
        fatal: true,
        path: ["courier"],
        code: z.ZodIssueCode.custom,
        message:
          "To use `courier` as an email client, property `courier` should be defined in the configuration file",
      });
    }
  });

/**
 * `zod` will automatically infer the type of the
 * configuration schema. This type will be used
 * in the `Config` class.
 */
type ConfigType = z.infer<typeof CONFIG_SCHEMA>;

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
  private readonly nodeEnv: "production" | "test" | "development";

  constructor(private readonly logger: Logger) {
    this.initialized = false;
    this.internal = {} as any;
    this.nodeEnv = process.env.NODE_ENV as any;
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
        } // Undefined behavior
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
