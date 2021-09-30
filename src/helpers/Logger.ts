import chalk from "chalk";

class Logger {
  raw = (m: any) => console.log(m);

  info(m: any) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.log(`${prefix} ${m}`);
  }

  error(e: any) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${prefix} ${e}`);
  }

  warn(m: any) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.log(`${prefix} ${m}`);
  }
}

export default Logger;
