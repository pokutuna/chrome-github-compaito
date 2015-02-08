/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />
import common = require('./common');

function isHostEnabled(url: string, config: common.CompaitoConfig): boolean {
    var match = /^\w+:\/\/([^\/]+)/.exec(url);
    if (!match) return false;
    var host = match[1];
    return Object.keys(config.hosts).some(function(key) {
        var pattern = new RegExp('^' + key.replace(/\*/g, '.+?') + '$');
        return pattern.test(host);
    });
}

chrome.tabs.onUpdated.addListener(function (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
   if (changeInfo.status === 'complete') {
       chrome.storage.sync.get(common.DEFAULT_CONFIG, (config: common.CompaitoConfig) => {
           if (isHostEnabled(tab.url, config)) {
               chrome.tabs.executeScript(tabId, { file: 'js/content.js' })
               chrome.tabs.insertCSS(tabId, { file: 'css/content.css' })
           }
       });
    }
})
