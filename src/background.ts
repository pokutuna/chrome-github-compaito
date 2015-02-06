/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="lib/compaito.ts" />

chrome.tabs.onUpdated.addListener(function (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
   if (changeInfo.status === 'complete') {
       chrome.storage.sync.get({ hosts: { 'github.com': true} }, function(config: compaito.CompaitoConfig) {
           // TODO use ComapitoConfig type
           if (/^chrome/.test(tab.url)) return;
           chrome.tabs.executeScript(tabId, { file: 'js/content.js' })
           chrome.tabs.insertCSS(tabId, { file: 'css/content.css' })
       });
    }
})
