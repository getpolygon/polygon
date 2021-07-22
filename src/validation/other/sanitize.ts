import BW from "bad-words";
import sanitizeHtml from "sanitize-html";
const BadWordsFilter = new BW({ placeHolder: "*" });

export default (input: string, _: any) => clean(input);
const clean = (input: string) => BadWordsFilter.clean(sanitizeHtml(input));
