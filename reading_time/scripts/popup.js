function updateReadingTime() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { type: 'updateReadingTime' }, function(response) {
        
        const readingTime = response.data;
        const readingTimeSpan = document.getElementById('reading-time');
        
        if (readingTimeSpan) {
          readingTimeSpan.textContent = readingTime;
        }
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    updateReadingTime();
  });