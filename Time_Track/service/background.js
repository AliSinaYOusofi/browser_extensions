chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'saveTimeSpent') {
        

        chrome.storage.local.get(null, function(data) {

            let keys = Object.keys(data);
            let previousDomain = request.data?.currentLocation
            
            keys.forEach( id => {
                if (data[id].currentLocation === previousDomain) {
                    
                    let previousHasHours = data[id].timeSpent?.split(":").length === 3;
                    let newHasHours = request.data.timeSpent?.split(":").length === 3;
    
                    let previousTimeSpent = data[id]?.timeSpent.split(":");
                    let newTimeSpent = request.data.timeSpent?.split(":");

                    let previousHr, previousMin, previousSec;
                    let newHr, newMin, newSec;
                    
                    if (previousHasHours && newHasHours) {
                        // for the hour part
                        [previousHr, previousMin, previousSec] = previousTimeSpent;
                        console.log(previousHr, previousMin, previousSec, 'previous has hours')
                        [ newHr, newMin, newSec] = newTimeSpent;
                    }
                    else {
                        // minute and second part
                        [previousMin, previousSec] = previousTimeSpent;
                        [newMin, newSec] = newTimeSpent
                        
                        let totalSeconds = previousSec + newSec;
                        let remainingSeconds = totalSeconds % 60;
                        let totalMinutes = previousMin + newMin + Math.floor(totalSeconds / 60);
                        let remainingMinutes = totalMinutes % 60;

                        console.log(`Total time spent: ${remainingMinutes} minutes and ${remainingSeconds} seconds`);

                        console.log("**************************END*********************");
                        
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