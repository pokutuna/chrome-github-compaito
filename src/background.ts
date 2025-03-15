import { CompaitoConfig } from './components/CompaitoConfig';

chrome.tabs.onUpdated.addListener(
    (tabId: number,
     changeInfo: chrome.tabs.TabChangeInfo,
     tab: chrome.tabs.Tab) => {
         if (changeInfo.status === 'complete') {
             if (CompaitoConfig.getConfig().isHostEnabled(tab.url)) {
                 chrome.tabs.executeScript(tabId, { file: 'js/content.js' });
                 chrome.tabs.insertCSS(tabId, { file: 'css/content.css' });
             }
         }
     }
);
