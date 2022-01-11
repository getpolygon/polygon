import chalk from "chalk";
import { Service } from "typedi";

@Service()
/**
 * Logger service. Provides a simple interface for logging.
 */
export class Logger {
  public raw(m: unknown, ...op: unknown[]) {
    console.log(m, ...op);
  }

  public info(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${prefix} >`, m, ...op);
  }

  public error(e: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${prefix} >`, e, ...op);
  }

  public warn(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${prefix} >`, m, ...op);
  }

  public debug(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.gray("DEBUG")}]`;
    console.log(`${prefix} >`, m, ...op);
  }
}
