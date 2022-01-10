import fs from "fs";
import path from "path";

/**
 * Helper function for reading templates to string.
 *
 * @param name - Template name or path without `.hbs` extension
 */
export const readTemplate = (name: string): string => {
  const templatePath = path.resolve(`${__dirname}/templates/${name}.hbs`);
  const template = fs.readFileSync(templatePath);
  return template.toString();
};
