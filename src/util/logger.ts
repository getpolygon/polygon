import chalk from "chalk";
import { Service } from "typedi";

@Service()
/**
 * Logger service. Provides a simple interface for logging.
 */
export class Logger {
  public raw(...m: any) {
    console.log(m);
  }

  public info(...m: any) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${prefix} > ${m}`);
  }

  public error(...e: any) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${prefix} > ${e}`);
  }

  public warn(...m: any) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${prefix} > ${m}`);
  }

  public debug(...m: any) {
    const prefix = `[${chalk.gray("DEBUG")}]`;
    console.log(`${prefix} > ${m}`);
  }
}
