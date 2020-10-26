const router = require("express").Router();
const emailValidator = require("email-validator");

const AccountSchema = require("../models/account");

// Route to check email when registering (Using it for AJAX requests)
router.post("/", async (req, res) => {
  const inputEmail = await req.body.email;
  // Validating user's email
  const validateEmail = await emailValidator.validate(inputEmail);

  // If email validation fails
  if (validateEmail == false) {
    res.json({
      emailValidity: false,
    });
  }

  // If email validation succeeds
  else {
    await AccountSchema.findOne({ email: inputEmail })
      .then((doc) => {
        if (doc == null) {
          res.json({
            result: false,
            emailValidity: true,
          });
          return;
        }

        if (doc.email == inputEmail) {
          res.json({
            result: true,
            emailValidity: true,
          });
          return;
        }

        if (!doc) {
          res.json({
            result: err,
          });
          return;
        } else {
          res.json({
            result: false,
            emailValidity: true,
          });
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

module.exports = router;
