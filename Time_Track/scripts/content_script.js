let timeTrack = document.createElement("div");
timeTrack.classList.add("time-track");
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0;
let offsetY = 0;

document.body.appendChild(timeTrack);


let time = 0;

function incrementTime() {
    time++;
    updateTimeDisplay();
}

function formatTime() {

    let seconds = time % 60;
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);
    
    seconds = (seconds < 10 ? "0" : "") + seconds;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    
    return (hours > 0) ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;

}


setInterval(function() {
    let currentUrl = window.location.href;
  
  
    let currentTime = formatTime();
  

    localStorage.setItem(currentUrl, currentTime);
}, 1000);

setInterval(incrementTime, 1000);

function getTimeSpent() {
    let currentUrl = window.location.href;
    let timeSpent = localStorage.getItem(currentUrl);
  
    if (timeSpent) return timeSpent;
    
    return "00:00";
    
}

function updateTimeDisplay() {
    
    var timeSpent = getTimeSpent();

    const styles = `
        .time_track {
            position: fixed;
            z-index: 9999;
            top: 12%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 12px;
            background-color: #cc0066;
            color: black;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            line-height: 1;
            white-space: nowrap;
            width: fit;
            cursor: grab;
            transition: transform 0.2s ease-in-out;
            background: linear-gradient(to bottom right, rgba(255,255,255,0.15), rgba(0,0,0,0.05));
            backdrop-filter: blur(10px);
            opacity: 0.85;
        }

        .reading-time-badge:hover {
            transform: translate(-50%, -50%) scale(1.1);
        }
    `;

    const styleTag = document.createElement("style");
    
    styleTag.textContent = styles;
    document.head.insertAdjacentElement("beforeend", styleTag);
    timeTrack.innerHTML = "Time spent on this website: " + timeSpent;
    timeTrack.classList.add("time_track")

    timeTrack.addEventListener('mousedown', handleMouseDown);
    timeTrack.addEventListener('mousemove', handleMouseMove);
    timeTrack.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(event) {
    event.preventDefault();
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    const { top, left } = timeTrack.getBoundingClientRect();
    offsetX = dragStartX - left;
    offsetY = dragStartY - top;
}

function handleMouseMove(event) {
    event.preventDefault();
    if (isDragging) {
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        timeTrack.style.top = `${y}px`;
        timeTrack.style.left = `${x}px`;
    }
}

function handleMouseUp(event) {
    event.preventDefault();
    isDragging = false;
    timeTrack.removeEventListener("mousedown", handleMouseDown);
}

function removeEventListern() {
    
}

