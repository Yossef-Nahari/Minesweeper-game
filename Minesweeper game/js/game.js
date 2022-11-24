'use strict'

var gBoard
var gEmojy
var gTimer
var gLivesCount
var gStartTime
var gIntervalTimer

var gLevel = {
    size: 4,
    mines: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const FLAG = '🚩'
const MINE = '💣'
const EMPTY = ' '

// This func starts game and also restart it (fresh start)
function init() {
    if (!gGame.isOn) return
    onPlaySound('click')
    resetValues()
    renderInfoBoard()
    gBoard = buildBoard()
    renderBoard(gBoard, '.gameBoard')
    setBackground()
    hideElement('.mainMenu')
    showElement('.infoBoard')
    showElement('.gameBoard')
}

// Get a level from user by mainMenu and return board size and quantity of mines
function levelPicker(level) {
    gGame.isOn = true
    onPlaySound('click')
    // Remove any previous level selected
    var elLevelButtons = document.querySelectorAll('.level')
    for (var i = 0; i < 3; i++) {
        elLevelButtons[i].classList.remove('selected')
    }
    // Select current chosen level
    var elLevelButton = document.querySelector(`.${level}`)
    elLevelButton.classList.add('selected')
    if (level === 'level1') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    else if (level === 'level2') {
        gLevel.size = 8
        gLevel.mines = 14
    }
    else {
        gLevel.size = 12
        gLevel.mines = 32
    }
}

// Create a board
function buildBoard() {
    var cell
    const board = []
    // Create the Matrix
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

// Render the board to an HTML table
function renderBoard(board, selector) {
    var cellPres

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var currCell = board[i][j]
            currCell.minesAroundCount = setMinesNegsCount(i, j, currCell, board)
            const className = `cell cell-${i}-${j}`
            if (currCell.isShown) cellPres = currCell.minesAroundCount
            else if (!currCell.isShown && !currCell.isMarked) cellPres = ''
            else cellPres = FLAG

            strHTML += `<td class="${className}" oncontextmenu="flagAction({i:${i},j:${j}}); return false" onclick="cellClicked({i:${i},j:${j}})">${cellPres}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Set the number of neighbors for each cell
function setMinesNegsCount(cellI, cellJ, currCell, board) {
    if (currCell.isMine === true) return MINE
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine === true) neighborsCount++;
        }
    }
    return neighborsCount;
}

// Return the value to show on the screen for each cell
function checkCellType(cellType, isVisible) {
    if (cellType === '💣' && !isVisible) return ''
    else if (isVisible) {
        if (cellType === 0) return ''
        else if (cellType > 0) return cellType
        else return MINE
    }
}

// Check the clicked cell
function cellClicked(location) {
    var cell = gBoard[location.i][location.j]
    if (!gGame.isOn || cell.isMarked || cell.isShown) return
    cell.isShown = true
    if (isAnyReveal() === 1) {
        minesCreator()
        startTimer()
    }
    var visibleClass = (cell.minesAroundCount === MINE) ? 'showRed' : 'showGreen'
    renderCell(location, cell.minesAroundCount, visibleClass)
    if (cell.minesAroundCount === MINE) {
        checkLoose()
    } else if (cell.minesAroundCount > 0) {
        checkVictory()
    } else if (cell.minesAroundCount === 0) {
        checkVictory()
        revealNeighbors(location.i, location.j, gBoard)
    }
}

// Render the movement in DOM (location is an object like this - { i: 2, j: 7 })
function renderCell(location, value, visibleClass) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    if (visibleClass !== 'inital') {
        elCell.classList.add(visibleClass)
        elCell.innerHTML = checkCellType(value, true)
    } else {
        elCell.innerHTML = checkCellType(value, false)
        renderBoard(gBoard, '.gameBoard')
    }
}

// Check a bomb clicked cell
function checkLoose() {
    gLivesCount--
    getEmojy()
    getLivesCounter(gLivesCount)
    var failSound = (gLivesCount > 0) ? 'bomb' : 'loose'
    onPlaySound(failSound)
    var playerStatus = (gLivesCount >= 1) ? 'fail' : 'loose'
    getPlayerStatus(playerStatus)
    if (gLivesCount === 0) {
        clearInterval(gIntervalTimer)
        gGame.isOn = false
    }
}

// Check if player won
function checkVictory() {
    const remainCells = checkLeftCells()
    var goodMoveSound = (remainCells > 0) ? 'click' : 'victory'
    onPlaySound(goodMoveSound)
    var playerStatus = (remainCells > 0) ? 'pass' : 'win'
    getPlayerStatus(playerStatus)
    const elEmojy = document.querySelector('.emojyButton')
    elEmojy.innerText = (remainCells > 0) ? '😁' : '🤩'
    if (remainCells === 0) {
        clearInterval(gIntervalTimer)
        gGame.isOn = false
        checkScore()
        topScoreModal()
    }
}

// Check if there is any relevant cells on board to reveal
function checkLeftCells() {
    var cellsReveal = 0
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j]
            if (currCell.minesAroundCount !== MINE && currCell.isShown) {
                cellsReveal++
            }
        }
    }
    if (gLevel.size === 4) return 14 - cellsReveal
    else if (gLevel.size === 8) return 50 - cellsReveal
    else return 112 - cellsReveal
}

// Check if there is one or more shown cells (any type)
function isAnyReveal() {
    var revealCount = 0
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown === true) {
                revealCount++
            }
        }
    }
    return revealCount
}

// Create mine
function mineCreator() {
    const unShownCells = []
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isShown) {
                unShownCells.push({ i, j })
            }
        }
    }
    var randomUnShownCells = getRandomInt(0, unShownCells.length)
    var randomUnShownCell = unShownCells.splice(randomUnShownCells, 1)[0]
    gBoard[randomUnShownCell.i][randomUnShownCell.j] = {
        minesAroundCount: MINE,
        isShown: false,
        isMine: true,
        isMarked: false
    }
    renderCell(randomUnShownCell, MINE, 'inital')
}

// Create several mines (by request) - use mineCreator function
function minesCreator() {
    for (var i = 0; i < gLevel.mines; i++) {
        mineCreator()
    }
}
