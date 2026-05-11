let grid = document.getElementsByClassName('card');
let choices = [];
let isSet = false;
let count = 0;
let journey = 0;
let isAnimating = false;


const FLIP_DURATION = 500;
const SHOW_DELAY = 200; 
const MEMORIZE_TIME = 1500; 


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function flipCardToWhite(index) {
    if (grid[index].style.backgroundColor === 'white') return;
    
    grid[index].style.transform = 'rotateX(180deg)';
    setTimeout(() => {
        grid[index].style.backgroundColor = 'white';
    }, FLIP_DURATION / 2);
}

function flipCardToBlue(index) {
    if (grid[index].style.backgroundColor !== 'white') return;
    
    grid[index].style.transform = 'rotateX(0deg)';
    setTimeout(() => {
        grid[index].style.backgroundColor = '';
    }, FLIP_DURATION / 2);
}


async function showPattern() {
    isAnimating = true;
    for (let i = 0; i < choices.length; i++) {
        flipCardToWhite(choices[i]);
        await sleep(SHOW_DELAY);
    }
    await sleep(MEMORIZE_TIME);
    for (let index of choices) {
        flipCardToBlue(index);
    }
    await sleep(FLIP_DURATION);
    isSet = true;
    isAnimating = false;
}

function handleCardClick(index) {
    if (isAnimating || !isSet) return;
    if (grid[index].style.backgroundColor === 'white') return;
    flipCardToWhite(index);
    if (choices.includes(index)) {
        count++;
        if (count === choices.length) {
            levelComplete();
        }
    } else {
        console.log('Wrong!');
        removeHeart();
        setTimeout(() => {
            flipCardToBlue(index);
        }, 800);
    }
}

async function levelComplete() {
    isAnimating = true;
    await sleep(500);
    let levelElement = document.querySelector('.level');
    let currentLevel = parseInt(levelElement.innerText.split(' ')[1]);
    levelElement.innerText = `Level ${currentLevel + 1}`;
    for (let i = 0; i < grid.length; i++) {
        flipCardToBlue(i);
    }
    await sleep(FLIP_DURATION + 200);
    journey++;
    startGame();
}

function removeHeart() {
    const hearts = document.getElementsByClassName('heart');
    if (hearts.length > 0) {
        hearts[hearts.length - 1].remove();
        if (hearts.length === 0) {
            setTimeout(showGameOver, 500);
        }
    }
}

function showGameOver() {
    document.getElementById('game-over-modal').classList.add('show');
}

function restartGame() {
    window.location.reload();
}


function setHandlers() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].addEventListener('click', () => handleCardClick(i));
    }
}

function generatePattern() {
    choices.length = 0;
    let numCards = 2 + journey;
    if (numCards > grid.length) numCards = grid.length;
    while (choices.length < numCards) {
        let randomIndex = getRandomInt(0, grid.length - 1);
        if (!choices.includes(randomIndex)) {
            choices.push(randomIndex);
        }
    }
}

async function startGame() {
    isSet = false;
    isAnimating = true;
    count = 0;
    for (let i = 0; i < grid.length; i++) {
        grid[i].style.backgroundColor = '';
        grid[i].style.transform = 'rotateX(0deg)';
    }
    generatePattern();
    await sleep(500);
    await showPattern();
}

setHandlers();
startGame();