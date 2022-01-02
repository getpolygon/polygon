import chalk from "chalk";
import { logger } from "container";
import type { Handler, NextFunction, Request, Response } from "express";

/**
 * Calculates the time taken to execute a request.
 *
 * @param start - The start time of the request.
 */
const getLatency = (start: [number, number]): number => {
  // 1000000
  const NS_TO_MS = 1e6;
  // 1000
  const NS_PER_SEC = 1e9;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

/**
 * Simple middleware for logging requests
 * and related information in a development
 * environment.
 */
export const trace = (): Handler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on("close", () => {
      const latency = Math.floor(getLatency(start));
      const path = req.path.toLowerCase();
      const method = req.method.toUpperCase();

      logger.debug(
        `${chalk.bold(method)} - ${path} - ${chalk.bold(latency)}ms`
      );
    });

    return next(null);
  };
};
