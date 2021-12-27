import chalk from "chalk";

/**
 * Error thrown when an invalid configuration is encountered.
 */
export class InvalidConfigError extends Error {
  constructor(property: string, shouldBe: string) {
    super(
      `Configuration of ${property} is invalid. ${property} should be: ${chalk.bold(
        shouldBe
      )}`
    );
  }
}
