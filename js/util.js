'use strict'

// Reset all relevant variables to start a new game
function resetValues() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLivesCount = 3
    gEmojy = '😁'
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
    else if (gLivesCount === 2) gEmojy = '🤕'
    else gEmojy = '😡'
    const elEmojy = document.querySelector('.emojyButton')
    elEmojy.innerText = gEmojy
}

function getTimer() {
    const elTimer = document.querySelector('.timer span')
    elTimer.innerText = '000'
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
    var msg = ''
    if (status === 'start') msg = 'Hi! Lets do it! 💫'
    else if (status === 'pass') msg = 'Great! You awesome! 🫶🏻'
    else if (status === 'fail') msg = 'OMG! be careful! 🫣'
    else if (status === 'loose') msg = 'WTH! try again! 🙄'
    else if (status === 'win') msg = 'Amazing! thank you! 🥇'
    const elStatus = document.querySelector('.playerStatus')
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
function onPlaySound(fileName) {
    var popSound = new Audio('sound/${fileName}.mp3')
    popSound.play()
    console.log('done');
}