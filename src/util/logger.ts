import chalk from "chalk";
import { Service } from "typedi";
import { format } from "date-fns";

@Service()
/**
 * Logger service. Provides a simple interface for logging.
 */
export class Logger {
  public raw(m: unknown, ...op: unknown[]) {
    console.log(this.getDateString(), m, ...op);
  }

  public info(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${this.getDateString()} ${prefix} >`, m, ...op);
  }

  public error(e: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${this.getDateString()} ${prefix} >`, e, ...op);
  }

  public warn(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${this.getDateString()} ${prefix} >`, m, ...op);
  }

  public debug(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.blackBright("DEBUG")}]`;
    console.log(`${this.getDateString()} ${prefix} >`, m, ...op);
  }

  private getDateString(): string {
    const now = new Date();
    // dd/mm/yyyy@hh:mm:ssAM/PM
    const formatted = format(now, "dd.MM.uuuu@hh:mm:sbb");
    return chalk.dim(formatted);
  }
}
