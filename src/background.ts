/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status === 'complete') {
       // TODO check tab.url
       chrome.tabs.executeScript(tabId, { file: 'js/content.js' })
       chrome.tabs.insertCSS(tabId, { file: 'css/content.css' })
    }
})
