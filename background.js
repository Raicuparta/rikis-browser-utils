// For compatibility with multiple browsers
const global = typeof chrome === "undefined" ? browser : chrome;

function updateBadge() {
  global.cookies.get(
    {
      url: "https://int.autoscout24.ch/de",
      name: "NODE_SERVER_NAME"
    },
    cookie => {
      const text = cookie && cookie.value ? cookie.value.split("test")[1] : "";
      global.browserAction.setBadgeText({ text });
    }
  );
}

global.cookies.onChanged.addListener(updateBadge);
