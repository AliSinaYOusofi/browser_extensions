let timeTrackContainer = document.createElement("div");
let currentLocation = window.location.href;

timeTrackContainer.innerHTML = `
    <p class="timer"> </p>

    <div class="icon_container">
        <span class="minimize-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
    
        </span>

        <span class='theme '>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        </span>
    </div>
`;

timeTrackContainer.classList.add("time-track");

let timeTrackText = timeTrackContainer.querySelector("p");
let hideUnhideElements = timeTrackContainer.querySelector(".minimize-icon");
let theme = timeTrackContainer.querySelector(".theme")

let startPosX = 0;
let startPosY = 0;
let offsetX = 0;
let offsetY = 0;

document.body.appendChild(timeTrackContainer);

let timerInterval;

let startTime = Date.now();

function incrementTime() {
    
    let currentTime = Date.now();
    let timeDiff = currentTime - startTime;
    let timeSeconds = Math.floor(timeDiff / 1000);
    let timeString = formatTime(timeSeconds);
    updateTimeDisplay(timeString);
}

function formatTime(time) {
    
    let seconds = time % 60;
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = (seconds < 10 ? "0" : "") + seconds;
    minutes = (minutes < 10 ? "0" : "") + minutes;

    return hours > 0 ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;
}

function resetTimer() {
    
    clearInterval(timerInterval);
    startTime = Date.now();
    updateTimeDisplay("00:00");
    timerInterval = setInterval(incrementTime, 1000);

}


function handleLocationChange() {
    
    if (window.location.href !== currentLocation) {
        resetTimer();
        currentLocation = window.location.href;
    }

}

timerInterval = setInterval(incrementTime, 1000);

function updateTimeDisplay(timeSpent) {
    
    const styles = `
    .time-track {
        position: fixed;
        z-index: 9999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 12px;
        background-color: #cc0066;
        color: white;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        line-height: 1;
        white-space: nowrap;
        width: fit-content;
        height: 100ppx;
        cursor: grab;
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: transform 0.2s ease-in-out;
        background: black;
        backdrop-filter: blur(10px);
        opacity: 0.85;
    }
      
    .time-track:hover {
        transform: translate(-50%, -50%) scale(1.05);
    }
      
    .reading-time-badge:hover {
        transform: scale(1.1);
    }
      
    .light {
        background: white;
        color: black;
        opacity: 1;
    }
      
    .dark {
        background: black;
        color: white;
    }

    .icon_container {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        gap: 14px;
      }
    
    .icon_container span {
        margin-top: 10px;
    }

    .timer {
        margin-top: -17px;
        padding: 4px;
    }
    `;

    const styleTag = document.createElement("style");

    styleTag.textContent = styles;
    document.head.insertAdjacentElement("beforeend", styleTag);
    
    timeTrackText.textContent = timeSpent;
    
    // resetTimerIcon.style.cursor = 'pointer';
    hideUnhideElements.style.cursor = 'pointer';
    theme.style.cursor = 'pointer';

    // resetTimerIcon.style.width  = '25px';
    hideUnhideElements.style.width  = '25px';
    theme.style.width  = '25px';
    timeTrackText.style.fontSize = '100px';

    timeTrackContainer.classList.add("time-track");
    
    timeTrackContainer.addEventListener("mousedown", startDrag);
    // resetTimerIcon.addEventListener("click", resetTimerOnClick);
    theme.addEventListener("click", changeThemeOnClick);
    hideUnhideElements.addEventListener("click", handleHideUnhideOnClick);

}

function saveTimeSpent() {

    let timeSpent = timeTrackText.textContent;
    let currentTime = new Date().toLocaleString();

    chrome.runtime.sendMessage({ action: "saveTimeSpent", data: { currentLocation: currentLocation, timeSpent: timeSpent, currentTime: currentTime }}, function(response) {
        console.log(response, 'afg');
    });
}

function handleHideUnhideOnClick() {
    
    if (!hideUnhideElements.classList.contains("eye")) {
        
        hideUnhideElements.classList.add("eye");
        
        hideUnhideElements.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>`
        
        // resetTimerIcon.style.display = 'none';
        theme.style.display = 'none';
        timeTrackText.style.display = 'none'

    } else {
        
        hideUnhideElements.classList.remove("eye"); // remove the "eye" class
        
        hideUnhideElements.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      `
        // resetTimerIcon.style.display = 'flex';
        theme.style.display = 'flex';
        timeTrackText.style.display = 'flex'
    }
}

function changeThemeOnClick() {
    
    if (timeTrackContainer.classList.contains("light")) {
        timeTrackContainer.classList.remove("light");
        timeTrackContainer.classList.add("dark");
        theme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`
    } else {
        timeTrackContainer.classList.remove("dark");
        timeTrackContainer.classList.add("light");
        theme.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`
    }
}


// functions for dragging the div.
function handleMouseDown(event) {
    event.preventDefault();

    dragStartX = event.clientX;
    dragStartY = event.clientY;
    const { top, left } = timeTrackContainer.getBoundingClientRect();
    offsetX = dragStartX - left;
    offsetY = dragStartY - top;
}

function moveElement(event) {
    const newX = event.clientX - offsetX;
    const newY = event.clientY - offsetY;

    timeTrackContainer.style.left = newX + "px";
    timeTrackContainer.style.top = newY + "px";
}

function startDrag(event) {
    startPosX = timeTrackContainer.offsetLeft;
    startPosY = timeTrackContainer.offsetTop;
    offsetX = event.clientX - startPosX;
    offsetY = event.clientY - startPosY;

    document.addEventListener("mousemove", moveElement);
}

function stopDrag() {
    document.removeEventListener("mousemove", moveElement);
}

document.addEventListener("mouseup", stopDrag);

window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    saveTimeSpent();
})

setInterval( () => {

    saveTimeSpent()
}, 5000)