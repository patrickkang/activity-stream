var urlParse = require("url-parse");

module.exports = {
  toRGBString(...color) {
    const name = color.length === 4 ? "rgba" : "rgb";
    return `${name}(${color.join(", ")})`;
  },

  getBlackOrWhite(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? "black" : "white";
  },

  prettyUrl(url) {
    if (!url) {
      return "";
    }
    return url.replace(/^((https?:)?\/\/)?(www\.)?/i, "").toLowerCase();
  },

  sanitizeUrl(url) {
    const ALLOWED_QUERY_PARAMS = new Set(["id", "p", "q", "query", "s", "search", "sitesearch"]);
    const REMOVE_KEYS = ["auth", "password", "username"];
    const parsedUrl = urlParse(url, true);
    const safeQueryParams = {};

    // Remove any unwanted username/password from the parsed URL.
    REMOVE_KEYS.forEach((key) => parsedUrl.set(key, ""));

    // Filter out the allowed query params from the specified URL and update the
    // query string.
    Object.keys(parsedUrl.query)
      .filter((param) => ALLOWED_QUERY_PARAMS.has(param))
      .forEach((param) => safeQueryParams[param] = parsedUrl.query[param]);

    parsedUrl.set("query", safeQueryParams);

    // If there was not a specified protocol (ie: //mozilla.com), specify HTTPS.
    if (!parsedUrl.protocol) {
      parsedUrl.set("protocol", "https:");
    }

    return parsedUrl.toString();
  }
};
