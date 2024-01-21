function cookieFalling() {
    let container = document.createElement('div');
    container.className = "fallingContainer";
    document.body.appendChild(container);

    for (let i = 0; i < 100; i++) {
        let cookies = document.createElement('div');
        cookies.className = "fallingCookie";
        cookies.innerText = '🍪';
        container.appendChild(cookies);
        cookies.style.left = `${Math.random() * 100}%`;
        
        if (Math.random() > 0.5) {
            cookies.style.animation = "bounce1 1.75s linear infinite";
        }
        else {
            cookies.style.animation = "bounce2 1.75s linear infinite";
        }

        cookies.style.animationDelay = `-${Math.random() * 7}s`;
    }
    container.appendChild(document.querySelector('.cookie-container'));
}

function getRandomPosition() {
    // Get viewport dimensions
    const screenWidth = window.innerWidth - 200;
    const screenHeight = window.innerHeight - 200;

    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    return { x: randomX, y: randomY };
}

function isCookieOverlapping(position, cookieWidth, cookieHeight, gifElement) {
    const gifRect = gifElement.getBoundingClientRect();
    const cookieRect = {
        left: position.x,
        top: position.y,
        right: position.x + cookieWidth,
        bottom: position.y + cookieHeight,
    };

    return (
        cookieRect.left < gifRect.right &&
        cookieRect.right > gifRect.left &&
        cookieRect.top < gifRect.bottom &&
        cookieRect.bottom > gifRect.top
    );
}

let counter = 0;
let cookieFontSize = parseFloat(window.getComputedStyle(document.querySelector('.cookie')).getPropertyValue('font-size'));

function showGif() {
    const cookieElement = document.querySelector('.cookie');
    const gifElement = document.querySelector('.cookie-gif');
    const cookieWidth = cookieElement.clientWidth;
    const cookieHeight = cookieElement.clientHeight;

    counter++;
    document.querySelector(".counter").innerHTML = `Cookie Bites<br>${counter}`;
    document.querySelector("body").style.animation = "flowBackground .8s linear infinite";

    let newPosition;
    do {
        newPosition = getRandomPosition();
    } while (isCookieOverlapping(newPosition, cookieWidth, cookieHeight, gifElement));

    cookieElement.style.left = `${newPosition.x}px`;
    cookieElement.style.top = `${newPosition.y}px`;

    gifElement.style.animation = "appear .3s ease-in";
    gifElement.style.display = 'flex';
    gifElement.style.opacity = '1';

    cookieFontSize -= 10;

    cookieElement.style.fontSize = `${cookieFontSize}px`;

    if (cookieFontSize <= 15) {
        cookieElement.style.fontSize = '0px';

        document.querySelector('body').style.animation = "flowBackground 8s linear infinite";
        document.querySelector('h1').style.animation = "flowBackground 5s linear infinite";
        document.querySelector('h2').style.animation = "flowBackground 5s linear infinite";
        document.querySelector('.title').innerHTML = "Cookie devoured!<br>Hope you're full and fueled for more typing!";
        document.querySelector('button').style.opacity = '100%';
        document.querySelector('a').style.pointerEvents = "auto";

        cookieFalling();
    }
}


document.querySelector('.cookie').addEventListener('click', showGif);