import chalk from "chalk";
import { Service } from "typedi";

@Service()
/**
 * Logger service. Provides a simple interface for logging.
 */
export class Logger {
  public raw(m: any, ...op: any[]) {
    console.log(m, ...op);
  }

  public info(m: any, ...op: any[]) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${prefix} >`, m, ...op);
  }

  public error(e: any, ...op: any[]) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${prefix} >`, e, ...op);
  }

  public warn(m: any, ...op: any[]) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${prefix} >`, m, ...op);
  }

  public debug(m: any, ...op: any[]) {
    const prefix = `[${chalk.gray("DEBUG")}]`;
    console.log(`${prefix} >`, m, ...op);
  }
}
