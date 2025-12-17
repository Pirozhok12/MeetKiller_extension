chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isCounterActive: false });
});

// const defaultZoom = chrome.tabs.getZoom(tabId);
// console.log(defaultZoom, "defaultZoom");
// let zoomScale = [500, 400, 300, 250, 200, 175, 150, 
//     125, 110, 100, 90, 80, 75, 67, 50, 33, 25];

chrome.runtime.onMessage.addListener((msg, sender) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  if (msg.type === "ZOOM_OUT") {
    chrome.tabs.setZoom(tabId, 0.5);
  }
  if(msg.type === "ZOOM_RESET"){
    chrome.tabs.setZoom(tabId, 1);
  }

});
