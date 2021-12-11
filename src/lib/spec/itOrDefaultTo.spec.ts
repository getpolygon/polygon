import test from "ava";
import { itOrDefaultTo } from "lib/itOrDefaultTo";

test("`itOrDefaultTo()` doesn't fail", (t) => {
  t.is(itOrDefaultTo(null, "default"), "default");
});
