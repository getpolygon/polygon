/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2021, Michael Grigoryan
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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

/**
 * The schema for validating the configuration file for Polygon and handles the validation
 * of the configuration file.
 */
const CONFIG_SCHEMA = z
  .object({
    polygon: z
      .object({
        port: z.number().default(3001),
        ui: z.string().min(1).url().nullable().default(null),
        templates: z
          .optional(
            z.object({
              path: z.optional(z.string()).default("templates/"),
            })
          )
          .default({}),
        origins: z.optional(z.array(z.string())).default([]),
      })
      .default({}),

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
        secure: z.optional(z.boolean()).default(false),
      })
      .default({}),

    courier: z
      .optional(
        z.object({
          token: z.optional(z.string()).nullable().default(null),
          brand: z.optional(z.string()).nullable().default(null),
          events: z
            .object({
              verification: z.string().nullable().default(null),
              "reset-password": z.string().nullable().default(null),
            })
            .default({}),
        })
      )
      .default({}),
  })
  .superRefine((v, c) => {
    /**
     * If email verification is enabled, with a selected email client we will need to validate the `smtp`
     * configuration in order to not cause errors and undefined behavior at runtime.
     */
    if (v.email.enableVerification && v.email.client !== "none") {
      if (v.polygon.ui === null) {
        c.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          path: ["polygon", "ui"],
          message:
            "`polygon.ui` should be supplied for usage with email clients.",
        });
      }

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
     * If the selected email client is courier we will need to check if all the required properties of
     * the optional `courier` object are present. If they are not, zod will throw an error.
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

        // Verify the presence of required Courier events.
        Object.entries(v.courier.events).map(([__k, __v]) => {
          if (isNil(__v)) {
            c.addIssue({
              fatal: true,
              path: ["courier", "events", __k],
              code: z.ZodIssueCode.custom,
              message: `To use \`courier\` as an email client, a valid event ID for \`courier.events.${__k}\` should be specified.`,
            });
          }
        });
      });

      Object.entries(v.courier.events).map(([__k, __v]) => {
        if (isNil(__v)) {
          c.addIssue({
            fatal: true,
            code: z.ZodIssueCode.custom,
            path: ["courier", "events", __k],
            message: `Event ID for ${__k} cannot be \`null\`. Usage with Courier requires valid event IDs.`,
          });
        }
      });
    }
  });

type Schema = z.infer<typeof CONFIG_SCHEMA>;
type NodeEnv = "production" | "test" | "development";

@Service()
class Config {
  private internal: Schema;
  protected initialized: boolean;
  private readonly nodeEnv: NodeEnv;
  private readonly configPath: string;
  private readonly emitter: EventEmitter | undefined;
  protected static readonly UninitializedConfigError = class extends Error {
    constructor() {
      super();
      super.name = "UninitializedConfigError";
      super.message = "`Config` should be initialized before use.";
    }
  };

  constructor(
    // The Logger class will be automatically injected by typedi
    private readonly logger: Logger
  ) {
    this.initialized = false;
    this.internal = {} as unknown as Schema;
    // Default to "production" environment if `process.env` is undefined
    this.nodeEnv = (process.env.NODE_ENV as unknown as NodeEnv) || "production";
    this.configPath = path.resolve(
      env
        .get("POLYGON.CONFIG.PATH")
        .required()
        .default("./config.yaml")
        .asString()
    );

    /**
     * EventEmitter will only be initialized if `NODE_ENV`is not equal to `test`. Here we will initialize the
     * EventEmitter and register the `loadStart` and `loadEnd` events.
     */
    if (this.nodeEnv !== "test") {
      // Only initializing the EventEmitter when NODE_ENV is not equal to `test`.
      this.emitter = new EventEmitter();

      // This event will be triggered when the configuration starts loading
      this.emitter.on("loadStart", () => {
        return this.logger.debug("Loading the configuration...");
      });

      // This event will be triggered when the configuration ends loading
      this.emitter.on("loadEnd", () => {
        // prettier-ignore
        if (JSON.parse(process.env["POLYGON.CORE.LOGGING.ENABLE_CONFIG_LOG"] || "false")) {
          // prettier-ignore
          this.logger.debug("<class Config> :", this.internal);
        }

        return this.logger.debug("Finished loading the configuration...");
      });

      // This event will be triggered whenever an error occurs during the reading and the parsing
      // of the configuration file
      this.emitter.on("error", (error: Error) => {
        if (!(error instanceof ZodError)) {
          if (error instanceof YAMLError) {
            this.logger.error("Invalid YAML syntax error...");
          } else {
            this.logger.error("Loading configuration failed...");
          }

          this.logger.error(error);
        } else {
          this.logger.error("Configuration validation error...");
          error.issues.map((issue) => this.logger.error(issue.message));
        }

        return process.exit(1);
      });
    }
  }

  /**
   * This method will attempt to get the internal parsed and validated state of the configuration.
   * If the configuration is not initialized, this will throw an error.
   */
  public get(): Schema {
    if (this.initialized) return this.internal;
    else throw new Config.UninitializedConfigError();
  }

  /**
   * This method will attempt to read, parse and validate provided YAML configuration. If it is already initialized,
   * calling this method for the second time will not change anything.
   */
  public init() {
    if (!this.initialized) {
      try {
        this.emitter?.emit("loadStart");

        const file = fs.readFileSync(this.configPath).toString();
        const parsed = yaml.parse(file, { prettyErrors: true });
        const internal = CONFIG_SCHEMA.parse(parsed);

        this.initialized = true;
        this.internal = internal;
        this.emitter?.emit("loadEnd");
      } catch (error) {
        this.emitter?.emit("error", error);
      }
    }

    return this;
  }
}

/**
 * Initializing the configuration here since we
 * are not going to use it as a dependency
 */
export default Container.get(Config).init().get();
