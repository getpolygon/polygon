import test from "ava";
// required for reading `config` used by `readTemplate`
import "reflect-metadata";
import { readTemplate } from "../readTemplate";

test("`readTemplate()` should throw an error", async (t) => {
  await t.throwsAsync(async () => await readTemplate("nonexistent"));
});
