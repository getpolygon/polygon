import chalk from "chalk";

class Logger {
  info(m: any) {
    const prefix = chalk.blueBright("[INFO]");
    console.log(`${prefix} ${m}`);
  }

  error(e: any) {
    const prefix = chalk.redBright("[ERROR]");
    console.error(`${prefix} ${e}`);
  }

  warn(m: any) {
    const prefix = chalk.yellowBright("[WARNING]");
    console.log(`${prefix} ${m}`);
  }

  raw(m: any) {
    console.log(m);
  }
}

export default Logger;
