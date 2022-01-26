import path from "path";
import fs from "fs/promises";
import config from "@config";

/**
 * Reading the path of default templates from the
 * configuration file. The default value is `templates/`.
 */
const TEMPLATES_PATH = path.resolve(config.polygon.templates?.path);

/**
 * Helper function for reading templates to string.
 *
 * @param name - Template name or path without `.hbs` extension
 */
export const readTemplate = async (name: string): Promise<string> => {
  const templatePath = path.resolve(`${TEMPLATES_PATH}/${name}.html`);
  const template = await fs.readFile(templatePath);
  return template.toString();
};
