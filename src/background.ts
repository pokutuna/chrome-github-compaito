/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />
import common = require('./common');

chrome.tabs.onUpdated.addListener(function (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
   if (changeInfo.status === 'complete') {
       chrome.storage.sync.get(
           common.DEFAULT_CONFIG,
           (data: common.CompaitoConfigData) => {
               var config = new common.CompaitoConfig(data);
               if (config.isHostEnabled(tab.url)) {
                   chrome.tabs.executeScript(tabId, { file: 'js/content.js' })
                   chrome.tabs.insertCSS(tabId, { file: 'css/content.css' })
               }
           }
       );
    }
})
