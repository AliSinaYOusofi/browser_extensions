chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (request.action === 'saveTimeSpent') {
      let currentTab = tabs[0];
      let currentLocation = currentTab.url;
      if (!currentLocation) {
        // If the current tab doesn't have a URL, it may be an internal page like chrome://extensions/
        // We don't want to track time spent on those pages
        return;
      }
      chrome.storage.local.get(null, function(data) {
        let domainsList = { ...data };
        
        let currentData = {
          timeSpent: '00:00:00',
          currentLocation: currentLocation,
          currentTime: request.data.currentTime
        }
    
        if (domainsList[currentLocation]) {
          let previousData = domainsList[currentLocation];
          let previousTimeSpentInSecs = convertTimeToSecs(previousData.timeSpent);
          let totalTimeSpentInSecs = parseInt(previousTimeSpentInSecs) + 1;
          currentData.timeSpent = convertTotalTimeSpent(totalTimeSpentInSecs);
        }
        domainsList[currentLocation] = currentData;
        chrome.storage.local.set(domainsList, function() {
          sendResponse({ success: true });
        });
      });
      return true;
    }
  });
});

function convertTimeToSecs(time) {
  if (!time || typeof time !== 'string') {
    return 0;
  }
  let [hours = 0, mins = 0, secs = 0] = time.split(':');
  
  return (parseInt(hours, 10) || 0) * 3600 + (parseInt(mins, 10) || 0) * 60 + (parseInt(secs, 10) || 0);
}

function convertTotalTimeSpent(totalSecs) {
  let days = Math.floor(totalSecs / 86400);
  let remainingSecs = totalSecs % 86400;
  let hours = Math.floor(remainingSecs / 3600);
  let remainingMinSecs = remainingSecs % 3600;
  let mins = Math.floor(remainingMinSecs / 60);
  let secs = Math.floor(remainingMinSecs % 60);

  let timeStr = '';
  
  if (days > 0) {
    timeStr += `${days}days`;
  }

  if (hours < 10) {
    timeStr += '0';
  }
  timeStr += hours + ':';
  if (mins < 10) {
    timeStr += '0';
  }
  timeStr += mins + ':';
  if (secs < 10) {
    timeStr += '0';
  }
  timeStr += secs;
  
  return timeStr;
}