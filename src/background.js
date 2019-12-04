// For compatibility with multiple browsers
const global = typeof chrome === "undefined" ? browser : chrome;

chrome.browserAction.setBadgeBackgroundColor({ color: '#003468' });

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

updateBadge();
global.cookies.onChanged.addListener(updateBadge);
