
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'saveTimeSpent') {
        const uniqueId = chrome.runtime.id + "-" + Date.now();
        chrome.storage.local.set({ [uniqueId]: request.data }, function() {
            console.log("Data stored with ID " + uniqueId + " in local storage");
            sendResponse({ success: true });
        });
    }
    return true;
  });