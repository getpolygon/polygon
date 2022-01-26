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
import config from "@config";
import { compile } from "handlebars";
import { createTransport } from "nodemailer";
import { readTemplate } from "@lib/readTemplate";

const isNodemailerAndEnabled =
  config.email.client === "nodemailer" && config.email.enableVerification;

// Creating a Nodemailer transport
const nodemailer = isNodemailerAndEnabled
  ? createTransport({
      auth: {
        user: config.smtp.user!,
        pass: config.smtp.pass!,
      },
      host: config.smtp.host!,
      port: config.smtp.port!,
      secure: config.smtp.secure,
    })
  : null;

/**
 * Function for sending emails with Nodemailer.
 *
 * @param email - Recipient email address
 * @param data - Additional data to compile the template with
 * @param templateName - Template name or path without `.hbs` extension
 */
export const send = async (
  email: string,
  templateName: string,
  data?: object
) => {
  const template = await readTemplate(templateName);
  const html = compile(template)(data);

  const response = await nodemailer?.sendMail({
    html,
    to: email,
    priority: "high",
    sender: config.smtp.user!,
    subject: "Polygon email verification",
    from: `Polygon <${config.smtp.user!}>`,
  });

  return response;
};
