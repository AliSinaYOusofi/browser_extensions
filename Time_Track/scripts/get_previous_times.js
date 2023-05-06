chrome.storage.local.get(null, function (data) {
    const keys = Object.keys(data);
    
    console.log(data);
    const domains = {};

    keys.forEach((key, index) => {
        const website = data[key].currentLocation;
        const domain = website.split('/')[2];
        
        if (!domains[domain]) {
            domains[domain] = [];
        }
        
        domains[domain].push({
            key,
            website,
            timeSpent: data[key].timeSpent,
            currentTime: data[key].currentTime
        });
    });

    for (const domain in domains) {
        
        const domainContainer = document.createElement("details");
        domainContainer.style.width = '100%'

        domainContainer.setAttribute("id", domain);
        const domainSummary = document.createElement("summary");
        domainSummary.textContent = `${domain} ${getTotalTime(domains[domain])}`;
        domainSummary.style.fontWeight = "bold";
        domainSummary.style.minWidth     = '200px'      
        const div = document.createElement("div");

        domains[domain].forEach(({key, website, timeSpent, currentTime}) => {
            const listItem = document.createElement("div");

            listItem.classList.add("lists");
            listItem.setAttribute("id", key);
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between'; // center horizontally

            const leftContainer = document.createElement("div");
            leftContainer.style.display = "flex";
            leftContainer.style.alignItems = "center";
            leftContainer.style.justifyContent = 'space-evenly'

            // create location section
            const websiteLink = document.createElement("a");
            websiteLink.setAttribute("href", website);
            websiteLink.setAttribute("target", "_blank");
            websiteLink.setAttribute("class", 'video-link');
            websiteLink.textContent = website.length > 40 ? website.slice(0, 40) + '...' : website;
            websiteLink.style.marginLeft = '7px';
            websiteLink.style.fontSize = '14px';
            websiteLink.style.whiteSpace = 'nowrap';
            websiteLink.style.textOverflow = 'ellipsis'; // Add this line to show an ellipsis
            websiteLink.style.overflow = 'hidden'; // Add this line to hide the overflowing text
            websiteLink.style.fontWeight = "bold";
            websiteLink.style.cursor = 'pointer';

            // create svg icon element
            const icon = document.createElement("span");
            icon.setAttribute("class", "delete_icon");
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          `;
          // create time section
            const time = document.createElement("p");
            const spentTimeAt = document.createElement("span");

            time.textContent = "Amount of time: " + " " + timeSpent;
            spentTimeAt.textContent = 'Spent at: ' + currentTime;
            time.setAttribute("class", 'date-time');
            spentTimeAt.setAttribute("class", 'date-time');

            // add click event to icon element to delete the li
            icon.addEventListener("click", function() {
                chrome.storage.local.remove(key, function() {
                    listItem.remove();
                    
                    if (domains[domain].length === 0) {
                        domainContainer.remove();
                    }
                    
                    domainSummary.textContent = `Domain: ${domain} (${getTotalTime(domains[domain])})`;
                });
            });

            // add location and icon sections to left container
            leftContainer.appendChild(icon);
            leftContainer.appendChild(websiteLink);
            
            // add time section to right container
            listItem.appendChild(leftContainer);            
            listItem.appendChild(time);
            listItem.appendChild(spentTimeAt);
            
            // append div to containerDiv
            div.appendChild(listItem);
        });

        // append list items to domain container
        domainContainer.appendChild(domainSummary);
        domainContainer.appendChild(div);

        // append domain container to containerDiv
        containerDiv.appendChild(domainContainer);
    }
});

function getTotalTime(data) {
    const total = data.reduce((acc, curr) => {
        const time = curr.timeSpent.split(':');
        let seconds = 0;
    
        if (time.length === 3) {
            seconds = (+time[0]) * 3600 + (+time[1]) * 60 + (+time[2]);
        } else if (time.length === 2) {
            seconds = (+time[0]) * 60 + (+time[1]);
        }
    
        return acc + seconds;
    }, 0);
  
    const sec = total % 60;
    const min = Math.floor(total / 60) % 60;
    const hr = Math.floor(total / 3600);
  
    return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }