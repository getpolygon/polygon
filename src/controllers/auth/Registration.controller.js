const { JWT_TOKEN } = process.env;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const minio = require("../../db/minio");
const emailValidator = require("email-validator");
const AccountSchema = require("../../models/all/account");
const checkForDuplicates = require("../../helpers/checkForDuplicates");

exports.register = async (req, res) => {
  const email = _.toLower(req.body.email);
  const hasValidEmail = emailValidator.validate(email);
  const hasDuplicates = await checkForDuplicates({ email }, AccountSchema);

  if (hasValidEmail) {
    if (!hasDuplicates) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          // TODO
        } else {
          bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) {
              // TODO
            } else {
              const Account = new AccountSchema({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: hash,
              });

              if (req.file) {
                await minio.client.putObject(
                  minio.bucket,
                  `${Account._id}/${Account._id}.png`,
                  req.file.buffer,
                  req.file.size,
                  {
                    "Content-Type": req.file.mimetype,
                  }
                );

                const AvatarURL = await minio.client.presignedGetObject(
                  minio.bucket,
                  `${Account._id}/${Account._id}.png`
                );
                Account.avatar = AvatarURL;
              } else {
                Account.avatar = `https://avatars.dicebear.com/api/initials/${Account.firstName}=${Account.lastName}.svg`;
              }

              await Account.save();

              jwt.sign({ id: Account._id }, JWT_TOKEN, (err, token) => {
                if (err) {
                  // TODO
                } else {
                  // TODO
                  return res.status(201).cookie("jwt", token, {
                    httpOnly: true,
                    sameSite: true,
                    signed: true,
                    secure: true,
                  });
                  // .json(messages.register.successful);
                }
              });
            }
          });
        }
      });
    } else {
      // TODO
    }
  } else {
    // TODO
  }
};
