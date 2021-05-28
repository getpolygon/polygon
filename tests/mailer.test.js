const mailer = require("../src/helpers/mailer");

(async () => {
  const result = await mailer
    .init("johndoe@example.com", "Testing", "Testing")
    .send();

  console.log({ result });
})();
