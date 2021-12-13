import test from "ava";
import { itOrDefaultTo } from "lib/itOrDefaultTo";

test("`itOrDefaultTo()` should not fail", (t) => {
  t.is(itOrDefaultTo(null, "default"), "default");
});
