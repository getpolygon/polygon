import { userRepository } from "db/dao";
import emailValidator from "deep-email-validator-extended";
import { isNil } from "lodash";

// Middleware function for express-validator for validating user emails
export default async (value: string) => {
  // Checking if the email is really valid
  const { valid } = await emailValidator({
    email: value,
    validateMx: true,
    validateTypo: false,
    validateSMTP: false,
    validateRegex: true,
    validateMxTimeout: 500,
    validateDisposable: true,
  });

  // If the email is valid
  if (valid) {
    // Checking for existing users with that email
    const existingUser = await userRepository.findOne(
      { key: "email", value: value },
      ["id"]
    );

    // If there is no user with that email
    if (isNil(existingUser)) return Promise.resolve(valid);
    else return Promise.reject("Email is taken");
  } else return Promise.reject("Invalid email");
};
