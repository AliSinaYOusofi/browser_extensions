chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'saveTimeSpent') {
        

        chrome.storage.local.get(null, function(data) {

            let keys = Object.keys(data);
            let previousDomain = request.data?.currentLocation
            
            keys.forEach( id => {
                if (data[id].currentLocation === previousDomain) {
                    
                    console.log("updating previous data");
                    let previousHasHours = data[id].timeSpent?.split(":").length === 3;
                    let newHasHours = request.data.timeSpent?.split(":").length === 3;
    
                    let previousTimeSpent = data[id]?.timeSpent.split(":");
                    let newTimeSpent = request.data.timeSpent?.split(":");

                    let previousHr, previousMin, previousSec;
                    let newHr, newMin, newSec;
                    
                    if (previousHasHours && newHasHours) {
                        // for the hour part
                        [previousHr, previousMin, previousSec] = previousTimeSpent;
                        [ newHr, newMin, newSec] = newTimeSpent;
                    }
                    else {
                        // minute and second part
                        [newMin, newSec] = newTimeSpent

                        if (data[id].timeSpent) {
                            [previousMin, previousSec] = previousTimeSpent;
                        }
                        
                        let updatedTimeSpent
                        totalSeconds = parseInt(previousSec) + 5
                        
                        
                        if (totalSeconds >= 60) {
                            previousMin = parseInt(previousMin) + 1
                            totalSeconds = 0;

                        }
                        console.log(previousMin + ":" + previousSec, " prev");
                        updatedTimeSpent = `${previousMin.toString().padStart(2, '0')}:${((parseInt(previousSec) + parseInt(newSec)) % 60).toString().padStart(2, '0')}`;

                        console.log(updatedTimeSpent, ' new');
                        data[id].timeSpent = updatedTimeSpent;

                        chrome.storage.local.set({ [id]: data[id] }, () => {
                            sendResponse({ success: true });
                        });

                        return;
                    }
                }
            })
            chrome.storage.local.set({ [request.data.currentLocation]: request.data }, function() {
                sendResponse({ success: true });
            });
        })
    }
    return true;
});