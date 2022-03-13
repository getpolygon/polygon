/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2021, Michael Grigoryan
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import chalk from "chalk";
import { Service } from "typedi";
import { format } from "date-fns";

@Service()
export class Logger {
  public raw(m: unknown, ...op: unknown[]) {
    console.log(this.getDateString(), m, ...op);
  }

  public info(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.blueBright("INFO")}]`;
    console.info(`${this.getDateString()} ${prefix} >`, m, ...op);
  }

  public error(e: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.redBright("ERROR")}]`;
    console.error(`${this.getDateString()} ${prefix} >`, e, ...op);
  }

  public warn(m: unknown, ...op: unknown[]) {
    const prefix = `[${chalk.yellowBright("WARNING")}]`;
    console.warn(`${this.getDateString()} ${prefix} >`, m, ...op);
  }

  public debug(m: unknown, ...op: unknown[]) {
    if (process.env.NODE_ENV !== "production") {
      const prefix = `[${chalk.blackBright("DEBUG")}]`;
      console.log(`${this.getDateString()} ${prefix} >`, m, ...op);
    }
  }

  private getDateString(): string {
    // dd/mm/yyyy@hh:mm:ssAM/PM by default
    const formatted = format(new Date(), "dd.MM.uuuu@hh:mm:saa");
    return chalk.dim(formatted);
  }
}
