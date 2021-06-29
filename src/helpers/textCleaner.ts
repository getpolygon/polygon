import BW from "bad-words";
import sanitizeHtml from "sanitize-html";
const BadWordsFilter = new BW({ placeHolder: "*" });
export default (text: string) => sanitizeHtml(BadWordsFilter.clean(text));
