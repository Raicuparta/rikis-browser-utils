const log = args => chrome.extension.getBackgroundPage().console.log(args);

document.addEventListener('DOMContentLoaded', function() {
  const getOriginName = () => document.getElementById('origin-cookie-name').value;
  const getOriginUrl = () => document.getElementById('origin-cookie-url').value;
  const getDestinationName = () => document.getElementById('destination-cookie-name').value;

  document
    .getElementById('copy-dev-context')
    .addEventListener('click', function() {
      const cookieName = 'AS24ApiAuth_int';

      chrome.tabs.query(
        {
          status: 'complete',
          windowId: chrome.windows.WINDOW_ID_CURRENT,
          active: true
        },
        function(tab) {
          chrome.cookies.getAll({ url: getOriginUrl() }, function(cookie) {
            for (i = 0; i < cookie.length; i++) {
              if (cookie[i].name === cookieName) {
                const { access, refresh } = JSON.parse(cookie[i].value);
                copyTextToClipboard(template(access.value, refresh.value));
              }
            }
          });
        }
      );
    });

  document
    .getElementById('move-cookie')
    .addEventListener('click', function() {
      chrome.tabs.query(
        {
          status: 'complete',
          windowId: chrome.windows.WINDOW_ID_CURRENT,
          active: true
        },
        function(tab) {
          console.error('tab0', getOriginUrl());
          chrome.cookies.getAll({ url: getOriginUrl() }, function (cookie) {
            for (i = 0; i < cookie.length; i++) {
              if (cookie[i].name === getDestinationName()) {
                chrome.cookies.set({
                  url: tab[0].url,
                  name: getOriginName(),
                  value: cookie[i].value
                }, () => {
                  chrome.tabs.reload();
                })
              }
            }
          });
        }
      );
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
  //Create a textbox field where we can insert text to.
  var copyFrom = document.createElement('textarea');

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //'execCommand()' only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}
