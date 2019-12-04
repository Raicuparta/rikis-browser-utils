function updateBadge() {
  browser.cookies.get(
    {
      url: "https://int.autoscout24.ch/de",
      name: "NODE_SERVER_NAME"
    },
    cookie => {
      const text = cookie && cookie.value ? cookie.value.split("test")[1] : "";
      browser.browserAction.setBadgeText({ text });
    }
  );
}

browser.cookies.onChanged.addListener(updateBadge);
