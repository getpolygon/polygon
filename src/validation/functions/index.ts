import { User } from "../../types/user";
import getFirst from "../../utils/db/getFirst";
import emailValidator from "deep-email-validator-extended";

// Middleware function for express-validator for validating user emails
export const validateEmail = async (value: string) => {
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

// Middleware function for express-validator for validating user usernames
export const validateUsername = async (value: string) => {
  // Validating the username with a regex
  const validRegex = /^[a-z0-9_\.]+$/.test(value);

  // If the regex isn't valid
  if (!validRegex) return Promise.reject("Invalid username");
  else {
    // Finding another user with the same username if it exists
    const existingUser = await getFirst<User>(
      "SELECT * FROM users WHERE username = $1;",
      [value]
    );

    // If there are no accounts with that username, make the field valid
    if (!existingUser) return Promise.resolve(validRegex);
    else return Promise.reject("Username is taken");
  }
};
