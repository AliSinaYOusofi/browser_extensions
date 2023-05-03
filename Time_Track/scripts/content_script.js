let timeTrackContainer = document.createElement("div");


timeTrackContainer.innerHTML = `
    <p> </p>
    <span class="close-icon">❌</span>
    <span class="minimize-icon">⮘</span>
    <span class="maximize-icon">⮚</span>
    <span class="reset-timer-icon">↺</span>
`;

timeTrackContainer.classList.add("time-track");

let timeTrackText = timeTrackContainer.querySelector("p");
let closeIcon = timeTrackContainer.querySelector(".close-icon");
let minimizeIcon = timeTrackContainer.querySelector(".minimize-icon");
let maximizeIcon = timeTrackContainer.querySelector(".maximize-icon");
let resetTimerIcon = timeTrackContainer.querySelector(".reset-timer-icon");

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

let currentLocation = window.location.href;

function handleLocationChange() {
    if (window.location.href !== currentLocation) {
        resetTimer();
        currentLocation = window.location.href;
    }
}

setInterval(handleLocationChange, 1000);

timerInterval = setInterval(incrementTime, 1000);

function getTimeSpent() {
    let timeSpent = localStorage.getItem(currentLocation);

    if (timeSpent) return timeSpent;

    return "00:00";
}

function updateTimeDisplay(timeSpent) {
    const styles = `
        .time-track {
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
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: center;
            row-gap: 5px;
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
    
    timeTrackText.textContent = timeSpent;
    closeIcon.textContent = '❌';
    minimizeIcon.textContent = '⮘';
    maximizeIcon.textContent = '⮚'
    resetTimerIcon.textContent = '↺';
    
    closeIcon.style.fontSize = '20px';
    minimizeIcon.style.fontSize = '28px';
    maximizeIcon.style.fontSize = '28px'
    resetTimerIcon.style.fontSize = '28px'
    resetTimerIcon.style.cursor = 'pointer';

    timeTrackContainer.classList.add("time-track");
    
    timeTrackContainer.addEventListener("mousedown", startDrag);
    resetTimerIcon.addEventListener("click", resetTimerOnClick)
}

function resetTimerOnClick() {
    resetTimer()
}
// functions for dragging the div.
function handleMouseDown(event) {
    event.preventDefault();
    isDragging = true;
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