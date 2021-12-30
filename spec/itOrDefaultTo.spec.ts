import test from "ava";
import { itOrDefaultTo } from "../src/lib/itOrDefaultTo";

test("`itOrDefaultTo()` should not fail", (t) => {
  t.is(itOrDefaultTo(null, "default"), "default");
});
