import test from "ava";
import { isUri } from "lib/isUri";

/**
 * List of valid URLs
 */
const VALID = [
  "http://www.example.org/addition/beef?angle=apparel",
  "http://border.example.com/",
  "http://bikes.example.org/#book",
  "http://www.example.com/birth.html",
  "http://example.com/bridge.htm?blade=breath&acoustics=addition",
];

/**
 * List of invalid URLs
 */
const INVALID = [
  "",
  "4fvqen049n032v\\",
  "rerfnwern0(#@0-03-1r",
  "12390rhf98cwninoviwerbiuvw",
  "443523489fjh9ac",
];

VALID.map((url) =>
  test(`${url} should be a valid URI`, (t) => t.is(isUri(url), true))
);

INVALID.map((url) =>
  test(`${url} should not be a valid URI`, (t) => t.is(isUri(url), false))
);
