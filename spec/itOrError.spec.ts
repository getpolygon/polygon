import test from "ava";
import { itOrError } from "../src/lib/itOrError";

test("`itOrError()` should throw an error", (t) => {
  t.throws(() => itOrError(null, new Error("Test passes")));
});
