let ul = document.getElementById("urlList");

chrome.storage.local.get(null, function (data) {
    const keys = Object.keys(data);

    console.log(data);
    const lis = keys.map((key, index) => {
        
        const li = document.createElement("li");

        li.setAttribute("id", key);

        // create flex container for location and icon
        const flex = document.createElement("div");
        flex.style.display = "flex";
        flex.style.alignItems = "center";
        flex.style.justifyContent = "justify-between"; // center horizontally
        flex.style.width = '100%'
        flex.style.marginTop = '20px'

        // create location section
        const location = document.createElement("a");
        location.setAttribute("href", data[key].currentLocation)
        location.setAttribute("target", "_blank");
        location.textContent ="website :" +  data[key].currentLocation;
        
        location.style.marginLeft = '4px';
        location.style.fontWeight = "bold";
        location.style.cursor = 'pointer';
        // create svg icon element
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("class", "delete-icon w-6 h-6");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("stroke-width", "1.5");
        icon.setAttribute("stroke", "currentColor");
        icon.setAttribute("fill", "none");
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>`;
        
        // add click event to icon element to delete the li
        icon.addEventListener("click", function() {
            chrome.storage.local.remove(key, function() {
                li.remove();
            });
        });
        
        // add icon to flex container
        flex.appendChild(icon);
        
        // create time section
        const time = document.createElement("span");
        const spentTimeAt = document.createElement("span");
        
        time.textContent = "Amount of time: " + " " + data[key].timeSpent;
        spentTimeAt.textContent = 'Time Spent on: ' + data[key].currentTime;
        
        // add location and time sections to li element
        li.appendChild(flex);
        li.appendChild(document.createElement("br")); // add a line break
        li.appendChild(time);
        li.appendChild(document.createElement("br"));
        li.appendChild(spentTimeAt);
        flex.appendChild(location);
        
        return li;
    });

    ul.append(...lis);
});