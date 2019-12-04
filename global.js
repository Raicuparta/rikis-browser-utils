// For compatibility with multiple browsers
const global = typeof chrome === "undefined" ? browser : chrome;

const optionFields = {
  testCookieName: {
    defaultValue: "NODE_SERVER_NAME",
    name: "Test Cookie Name"
  },
  testCookieDomain: {
    defaultValue: "int.autoscout24.ch",
    name: "Test Cookie Domain"
  },
  testCookieUrl: {
    defaultValue: "https://int.autoscout24.ch/de",
    name: "Test Cookie Url"
  },
};

const optionKeyValues = {}
Object.entries(optionFields).forEach(([key, { defaultValue }]) => {
  optionKeyValues[key] = defaultValue;
});
