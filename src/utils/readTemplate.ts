import { resolve } from "path";
import { readFileSync } from "fs";
export default (file: string): string =>
  readFileSync(resolve(`src/templates/${file}`)).toString();
