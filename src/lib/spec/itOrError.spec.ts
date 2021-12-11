import test from "ava";
import { itOrError } from "lib/itOrError";

test("`itOrError()` should throw an error", (t) => {
  t.throws(() => itOrError(null, new Error("Test passes")));
});
