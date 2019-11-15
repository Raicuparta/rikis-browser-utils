const log = args => chrome.extension.getBackgroundPage().console.log(args);
const getElement = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  const getOriginName = () => getElement("origin-cookie-name").value;
  const getOriginUrl = () => getElement("origin-cookie-url").value;
  const getDestinationName = () => getElement("destination-cookie-name").value;

  getElement("copy-dev-context").addEventListener("click", () => {
    chrome.cookies.get(
      {
        url: getOriginUrl(),
        name: getOriginName()
      },
      cookie => {
        const { access, refresh } = JSON.parse(cookie.value);
        copyTextToClipboard(template(access.value, refresh.value));
      }
    );
  });

  getElement("move-cookie").addEventListener("click", () => {
    chrome.tabs.getCurrent(tab => {
      chrome.cookies.get(
        {
          url: getOriginUrl(),
          name: getOriginName()
        },
        cookie => {
          chrome.cookies.set(
            {
              url: tab.url,
              name: getDestinationName(),
              value: cookie.value
            },
            () => {
              chrome.tabs.reload();
            }
          );
        }
      );
    });
  });
});

const template = (access, refresh) => `/* eslint-disable */

import { addYears } from 'date-fns';

const WEBSITE = 'AS24'; // 'AS24' or 'MS24'
const TARGET = 'INT'; // 'INT' or 'PROD'
const LANG = 'de'; // 'de' or 'fr' or 'it'

const env = JSON.parse(process.env.ENV_CMDRC);

const getEnv = VAR => env[\`\${TARGET}_\${WEBSITE}_\${VAR}\`]
  || env[\`\${WEBSITE}_\${VAR}\`]
  || env[\`\${VAR}\`];

const config = {
  website: WEBSITE.toLowerCase(),
  basePath: '/',
  domain: getEnv('DOMAIN'),
  apiUrl: getEnv('API_URL'),
  apiVersion: getEnv('API_VERSION'),
  pathname: global.location.pathname,
  search: global.location.search,
  lang: LANG,
  legacyUrl: getEnv('LEGACY_URL'),
  supportedLanguages: ['de', 'fr', 'it'],
  analytics: {
    gtmId: getEnv('GOOGLE_TAG_MANAGER_ID'),
    pixelUrl: getEnv('TRACKING_PIXEL_URL'),
  },
  captchaKey: getEnv('GOOGLE_CAPTCHA_KEY'),
  tokens: null,
  clientVersion: 'next',
  aspiUrls: {
    mobile: getEnv('AS24_ASPI_MOBILE_URL'),
    desktop: getEnv('AS24_ASPI_DESKTOP_URL'),
  },
  captchaUrls: {
    mobile: getEnv('CAPTCHA_MOBILE_URL'),
    desktop: getEnv('CAPTCHA_DESKTOP_URL'),
  },
  tokens: {
    access: {
    desktop: getEnv('CAPTCHA_DESKTOP_URL'),
      value: '${access}',
      ttl: 60 * 30,
      expiresAt: addYears(new Date(), 1),
    },
    refresh: {
      value: '${refresh}',
      ttl: 60 * 60 * 24 * 7,
      expiresAt: addYears(new Date(), 1),
    },
  },
};

export default config;`;

function copyTextToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}
