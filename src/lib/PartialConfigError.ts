/**
 * Partial configuration error class. This is used to ensure that the configuration is complete.
 *
 * @example
 * ```js
 * const error = new PartialConfigError("`smtp.host`");
 * throw error;
 * // Uncaught PartialConfigError
 * ```
 */
export class PartialConfigError extends Error {
  constructor(property: string) {
    super(
      `${property} was not supplied in \`config.yaml\`. Cannot use partial \`${property
        .split(".")[0]
        .replace(
          "`",
          ""
        )}\` configuration. Consider updating \`config.yaml\` or specifying an environment variable.`
    );
  }
}
