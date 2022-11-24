'use strict'

// Reset all relevant variables to start a new game
function resetValues() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLivesCount = 3
    gEmojy = '😁'
    clearInterval(gIntervalTimer)
    resetTime(gIntervalTimer)
    getTimer()
}

// Render infoBoard 
function renderInfoBoard() {
    gEmojy = getEmojy()
    gTimer = getTimer()
    getLivesCounter(gLivesCount)
    getFlagCounter(gGame.markedCount)
    getPlayerStatus('start')
}

// Render emojy 
function getEmojy() {
    if (gLivesCount === 3) gEmojy = '😁'
    else if (gLivesCount === 2) gEmojy = '🤒'
    else if (gLivesCount === 1) gEmojy = '🤕'
    else gEmojy = '😡'
    const elEmojy = document.querySelector('.emojyButton')
    elEmojy.innerText = gEmojy
}

// Render timer 
function getTimer() {
    const elTimer = document.querySelector('.timer span')
    elTimer.innerText = '0.000'
}

// Render lives 
function getLivesCounter(gLivesCount) {
    const elLives = document.querySelector('.lives span')
    elLives.innerText = gLivesCount
}

// Render flags 
function getFlagCounter(markedCount) {
    const elFlag = document.querySelector('.flag span')
    elFlag.innerText = markedCount
}

// Render playerLineStatus 
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

// Timer DOM reset
function resetTime() {
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = '0.000'
}

// Return a random number - the maximum is also inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

// Set a custom background after mainMenu
function setBackground() {
    const mybody = document.getElementsByTagName("body")[0]
    mybody.style.backgroundImage = "url(../img/backgroundStatic.png)"
    mybody.style.backgroundSize = "cover"
}

// Reveals neighbors
function revealNeighbors(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (!board[i][j].isMine && !board[i][j].isMarked) {
                board[i][j].isShown = true
                renderCell({ i: i, j: j }, board[i][j].minesAroundCount, 'showGreen')
            }
        }
    }
}

// When player click on right mouse click
function flagAction(location) {
    var cell = gBoard[location.i][location.j]
    if (cell.isShown || !isAnyReveal()) return
    cell.isMarked = !cell.isMarked
    gGame.markedCount = (cell.isMarked) ? gGame.markedCount + 1 : gGame.markedCount - 1
    getFlagCounter(gGame.markedCount)
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (elCell.classList.contains('flagType')) {
        elCell.classList.remove('flagType')
        elCell.innerHTML = ''
    }
    else {
        elCell.classList.add('flagType')
        elCell.innerHTML = '🚩'
    }
}

// Shows Top score modal
function topScoreModal() {
    showElement('.scoreChart')
}

// Check score and insert it to top if relevant
function checkScore() {
    const elTimer = document.querySelector('.timer span')
    const TimerScore = elTimer.innerText

    var topScore1 = localStorage.getItem('Top Beginner level', 999)
    var topScore2 = localStorage.getItem('Top Medium level', 999)
    var topScore3 = localStorage.getItem('Top Expert level', 999)

    if (gLevel.size === 4) {
        if (TimerScore < topScore1 || !topScore1) localStorage.setItem('Top Beginner level', TimerScore)
    }
    else if (gLevel.size === 8) {
        if (TimerScore < topScore2) localStorage.setItem('Top Medium level', TimerScore)
    }
    else {
        if (TimerScore < topScore3) localStorage.setItem('Top Expert level', TimerScore)
    }
    renderTopScore(topScore1, topScore2, topScore3)
}

// Render top score to DOM
function renderTopScore(topScore1, topScore2, topScore3) {
    const elTop1 = document.querySelector('.topScoreB span')
    elTop1.innerText = topScore3
    const elTop2 = document.querySelector('.topScoreM span')
    elTop2.innerText = topScore2
    const elTop3 = document.querySelector('.topScoreE span')
    elTop3.innerText = topScore1
}

// Actions when player click on Play button from top score modal
function playFromStartButton() {
    hideElement('.infoBoard')
    hideElement('.gameBoard')
    hideElement('.scoreChart')
    const mybody = document.getElementsByTagName("body")[0]
    mybody.style.backgroundImage = "url(../img/background2.gif)"
    // Remove any previous level selected
    var elLevelButtons = document.querySelectorAll('.level')
    for (var i = 0; i < 3; i++) {
        elLevelButtons[i].classList.remove('selected')
    }
    showElement('.mainMenu')
}