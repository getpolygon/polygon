import chalk from "chalk";
import { logger } from "@container";
import type { Handler } from "express";

// 1000000
const NS_TO_MS = 1e6;
// 1000
const NS_PER_SEC = 1e9;

/**
 * Calculates the time taken to execute a request.
 *
 * @param start - The start time of the request.
 */
const getLatency = (start: [number, number]): number => {
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

/**
 * Returns a colored string of the response status code.
 *
 * @param status - The status code of the response.
 */
const getColoredStatus = (status: number): string => {
  if (status >= 100 && status <= 199) return chalk.blue(status);
  else if (status >= 200 && status <= 299) return chalk.green(status);
  else if (status >= 300 && status <= 399) return chalk.gray(status);
  else return chalk.red(status);
};

/**
 * Returns a colored string of the request method.
 *
 * @param method - The HTTP method of the request.
 */
const getColoredMethod = (method: string): string => {
  switch (method.toLowerCase()) {
    case "get": {
      return chalk.green(method);
    }
    case "delete": {
      return chalk.red(method);
    }
    case "options": {
      return chalk.blue(method);
    }
    case "put":
    case "post": {
      return chalk.yellow(method);
    }
    default: {
      return method;
    }
  }
};

/**
 * Simple middleware for logging requests and related
 * information in a development environment.
 */
export const trace = (): Handler => {
  return (req, res, next) => {
    const start = process.hrtime();

    res.on("close", () => {
      // Latency
      const l = Math.floor(getLatency(start)) + "ms";
      // Path
      const p = req.originalUrl.toLowerCase();
      // Status code
      const s = getColoredStatus(res.statusCode);
      // Request method
      const m = getColoredMethod(req.method.toUpperCase());

      // Log request information
      logger.debug(chalk.bold(m), chalk.bold(p), chalk.bold(s), chalk.bold(l));
    });

    return next(null);
  };
};
