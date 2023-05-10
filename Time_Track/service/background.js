chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.action === 'saveTimeSpent') {
      
    let previousDomain = request.data?.currentLocation;
    
    chrome.storage.local.get(null, function(data) {
      let domainsList = { ...data };
      
      let currentData = {
        timeSpent: '00:00:00',
        currentLocation: previousDomain,
        currentTime: request.data.currentTime
      }

      if (domainsList[previousDomain]) {
          
        let previousData = domainsList[previousDomain];
        
        let previousTimeSpentInSecs = convertTimeToSecs(previousData.timeSpent);
        
        let totalTimeSpentInSecs = parseInt(previousTimeSpentInSecs) + 1;
        
        currentData.timeSpent = convertTotalTimeSpent(totalTimeSpentInSecs);
      }
      domainsList[previousDomain] = currentData;
      chrome.storage.local.set(domainsList, function() {
        sendResponse({ success: true });
    });
  });
    return true;
  }
});

function convertTimeToSecs(time) {
    if (!time || typeof time !== 'string') {
      return 0; // if time is not in the right format, return 0 seconds
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