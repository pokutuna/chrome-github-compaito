/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status === 'complete') {
       // TODO check tab.url github
       if (/^chrome/.test(tab.url)) return
       chrome.tabs.executeScript(tabId, { file: 'js/content.js' })
       chrome.tabs.insertCSS(tabId, { file: 'css/content.css' })
    }
})
