import test from "ava";
import { readTemplate } from "../src/lib/readTemplate";

test("`readTemplate()` should throw an error", (t) => {
  t.throws(() => readTemplate("nonexistent"));
});
