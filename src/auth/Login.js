const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({
      error: "Missing fields"
    });
  } else {
    try {
      const Account = await AccountSchema.findOne({ email: email });
      if (Account !== null) {
        const same = await bcrypt.compare(password, Account.password);
        if (same) {
          const token = jwt.sign({ id: Account._id }, process.env.JWT_TOKEN);
          return res.status(200).cookie("jwt", token, { httpOnly: true }).json({
            token: token
          });
        } else {
          return res.status(403).json({
            error: "Forbidden"
          });
        }
      } else {
        return res.status(200).json({
          error: "Forbidden"
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: error
      });
    }
  }
});

module.exports = router;
