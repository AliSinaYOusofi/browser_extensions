function updateReadingTime() {
    const allText = [...document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, i")].map(
        (el) => el.textContent.trim()
    ).join(" ");

    const wordMatch = /[^\s]+/g;
    const words = allText.matchAll(wordMatch);
    const wordCount = [...words].length;
    const readingTime = Math.round(wordCount / 200);
    const badge = document.createElement("p");

    badge.classList.add("reading-time-badge");
    badge.textContent = `⏱️ ${readingTime} min read`;

    const existingBadge = document.querySelector('.reading-time-badge');
    if (existingBadge) {
        // Replace existing badge if it exists
        existingBadge.replaceWith(badge);
    } else {
        document.body.appendChild(badge);
    }
}

function init() {
    updateReadingTime();
    const styles = `
        .reading-time-badge {
            position: fixed;
            z-index: 9999;
            top: 12%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 12px;
            background-color: #cc0066;
            color: darkgray;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
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
}

init();

window.addEventListener('popstate', () => {
    setTimeout(() => {
        updateReadingTime();
    }, 1000);
});