import fs from "fs";
import path from "path";

export const readTemplate = (name: string): string => {
  const templatePath = path.resolve(`templates/${name}.hbs`);
  const template = fs.readFileSync(templatePath);
  return template.toString();
};
