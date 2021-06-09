const sendMail = require("../src/helpers/mailer");

async function mail() {
  try {
    const result = await sendMail("johndoe@example.com", "Testing", "Testing", "<h1>Hello></h1>");
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

mail();
