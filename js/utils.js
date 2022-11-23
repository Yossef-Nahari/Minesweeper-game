'use strict'

// Reset all relevant variables to start a new game
function resetValues() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLivesCount = 3
    gEmojy = '😁'
    resetTime(gIntervalTimer)
    getTimer()
}

function renderInfoBoard() {
    gEmojy = getEmojy()
    gTimer = getTimer()
    getLivesCounter(gLivesCount)
    getFlagCounter(gGame.markedCount)
    getPlayerStatus('start')
}


function getEmojy() {
    if (gLivesCount === 3) gEmojy = '😁'
    else if (gLivesCount === 2) gEmojy = '🤒'
    else if (gLivesCount === 1) gEmojy = '🤕'
    else gEmojy = '😡'
    const elEmojy = document.querySelector('.emojyButton')
    elEmojy.innerText = gEmojy
}

function getTimer() {
    const elTimer = document.querySelector('.timer span')
    elTimer.innerText = '0.000'
}

function getLivesCounter(gLivesCount) {
    const elLives = document.querySelector('.lives span')
    elLives.innerText = gLivesCount
}

function getFlagCounter(markedCount) {
    const elFlag = document.querySelector('.flag span')
    elFlag.innerText = markedCount
}

function getPlayerStatus(status) {
    const elStatus = document.querySelector('.playerStatus')
    var msg = ''
    if (status === 'start') msg = 'Hi! Lets do it! 💫'
    else if (status === 'pass') msg = 'Great! You awesome! 🥰'
    else if (status === 'fail') msg = 'OMG! be careful! 🫣'
    else if (status === 'win') msg = 'Amazing! thank you! 🥇'
    else if (status === 'loose') {
        msg = 'WTH! try again! 🙄'
        elStatus.style.color = "red"
    }
    elStatus.innerText = msg
}


// Hide a selector
function hideElement(selector) {
    const elMainMenu = document.querySelector(selector)
    elMainMenu.classList.add('hidden')
}

// Show a selector
function showElement(selector) {
    const elInfoBoard = document.querySelector(selector)
    elInfoBoard.classList.remove('hidden')
}

// Play a specific sound file
function onPlaySound(sound) {
    var popSound = new Audio(`/sound/${sound}.mp3`)
    popSound.play()
}

// Timer function
function startTimer() {
    gStartTime = Date.now()
    gIntervalTimer = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elTimer = document.querySelector('.timer span')
        elTimer.innerText = seconds.toFixed(3)
    }, 1);
}

// Timer reset
function resetTime() {
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = '0.000'
}

//Return a random number - the maximum is also inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}