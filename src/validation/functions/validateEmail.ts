import { User } from "../../types/user";
import getFirst from "../../util/getFirst";
import emailValidator from "deep-email-validator-extended";

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
    const existingUser = await getFirst<User>(
      "SELECT * FROM users WHERE email = $1",
      [value]
    );

    // If there is no user with that email
    if (!existingUser) return Promise.resolve(valid);
    else return Promise.reject("Email is taken");
  } else return Promise.reject("Invalid email");
};
