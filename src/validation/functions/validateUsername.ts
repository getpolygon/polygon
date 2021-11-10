import getFirst from "../../util/getFirst";

// Middleware function for express-validator for validating user usernames
export default async (value: string) => {
  // Validating the username with a regex
  const validRegex = /^[a-z0-9_\.]+$/.test(value);

  // If the regex isn't valid
  if (!validRegex) return Promise.reject("Invalid username");
  else {
    // Finding another user with the same username if it exists
    const existingUser = await getFirst(
      "SELECT * FROM users WHERE username = $1;",
      [value]
    );

    // If there are no accounts with that username, make the field valid
    if (!existingUser) return Promise.resolve(validRegex);
    else return Promise.reject("Username is taken");
  }
};
