const log = args => global.extension.getBackgroundPage().console.log(args);
const getElement = id => document.getElementById(id);

global.storage.local.get(optionKeyValues, items => {
  const refresh = () => {
    global.tabs.update(null, {
      url: items.testCookieUrl
    }, window.close);
  }

  global.cookies.get(
    {
      url: items.testCookieUrl,
      name: items.testCookieName
    },
    cookie => {
      Array.from(document.getElementsByClassName("test-env")).forEach(element => {
        const cookieValue = cookie ? cookie.value : "";
        if ((element.id === `button-${cookieValue}`) || (element.id === 'button-int' && !cookieValue)) {
          element.className = "test-env selected";
          return;
        }

        element.addEventListener("click", () => {
          global.cookies.remove({
            url: items.testCookieUrl,
            name: items.testCookieName
          });
    
          if (element.value === "") {
            return refresh();
          }
    
          global.cookies.set(
            {
              url: items.testCookieUrl,
              domain: items.testCookieDomain,
              name: items.testCookieName,
              value: element.value,
              expirationDate: new Date(new Date().getFullYear() + 2, 1, 1).valueOf()
            },
            refresh
          );
        });
      })
    }
  );
});
