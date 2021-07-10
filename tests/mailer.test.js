const { send } = require("../src/helpers/mailer");

async function mail() {
  try {
    const result = await send(
      "johndoe@example.com",
      "Testing",
      "Testing",
      "<h1>Hello></h1>"
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

mail();
