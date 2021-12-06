import { parse } from "yaml";
import { resolve } from "path";
import { readFileSync } from "fs";
import { configPath } from "config/env";
import { IConfig } from "config/IConfig";

const path = resolve(configPath);
const file = readFileSync(path).toString();
const config: Partial<IConfig> = parse(file);

export default config;
