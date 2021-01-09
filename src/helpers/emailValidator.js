const emailValidator = require("email-validator");

function checkEmailValidity(email) {
  if (emailValidator.validate(email)) return email;
  else return false;
}

module.exports = checkEmailValidity;
