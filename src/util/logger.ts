import chalk from "chalk";
import { Service } from "typedi";

@Service()
/**
 * Logger service. Provides a simple interface for logging.
 */
export class Logger {
  public raw(m: any, ...optionalParams: any[]) {
    console.log(m, ...optionalParams);
  }

  public info(m: any, ...optionalParams: any[]) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${prefix} >`, m, ...optionalParams);
  }

  public error(e: any, ...optionalParams: any[]) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${prefix} >`, e, ...optionalParams);
  }

  public warn(m: any, ...optionalParams: any[]) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${prefix} >`, m, ...optionalParams);
  }

  public debug(m: any, ...optionalParams: any[]) {
    const prefix = `[${chalk.gray("DEBUG")}]`;
    console.log(`${prefix} >`, m, ...optionalParams);
  }
}
