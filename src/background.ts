import { CompaitoConfig } from './components/CompaitoConfig';

chrome.tabs.onUpdated.addListener(
    async (tabId: number,
     changeInfo: chrome.tabs.TabChangeInfo,
     tab: chrome.tabs.Tab) => {
         if (changeInfo.status === 'complete') {
             const config = await CompaitoConfig.getConfig();
             if (config.isHostEnabled(tab.url)) {
                 chrome.scripting.executeScript({
                     target: { tabId: tabId },
                     files: ['js/content.js']
                 });
                 chrome.scripting.insertCSS({
                     target: { tabId: tabId },
                     files: ['css/content.css']
                 });
             }
         }
     }
);
