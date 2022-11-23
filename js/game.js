'use strict'

var gBoard
var gEmojy
var gTimer
var gLivesCount

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
    resetValues()
    renderInfoBoard()
    gBoard = buildBoard()
    renderBoard(gBoard, '.gameBoard')
    hideElement('.mainMenu')
    showElement('.infoBoard')
}

// get a level from user by mainMenu and return board size and quantity of mines
function levelPicker(level) {
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

// create a board
function buildBoard() {
    var cell
    const board = []
    // Create the Matrix
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = cell = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    board[1][2] = cell = {
        minesAroundCount: MINE,
        isShown: true,
        isMine: false,
        isMarked: false
    }
    board[2][1] = cell = {
        minesAroundCount: MINE,
        isShown: true,
        isMine: false,
        isMarked: false
    }
    return board
}

// Render the board to an HTML table (from Pacman game)
function renderBoard(board, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var currCell = board[i][j]
            var visibleClass = (currCell.isShown) ? 'show' : 'hide'
            currCell.minesAroundCount = (!isNaN(currCell.minesAroundCount)) ? (setMinesNegsCount(i, j, board)) : MINE
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className} ${visibleClass}" onclick="cellClicked({i:${i},j:${j}})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// set the number of neighbors for each cell
function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].minesAroundCount === MINE) neighborsCount++;
        }
    }
    return neighborsCount;
}

// return the value to show on the screen for each cell
function checkCellType(cellType, isVisible) {
    if (isVisible) {
        if (cellType === 0) return ''
        else if (cellType > 0) return cellType
        else return MINE
    }
    return ''
}

// check the clicked cell
function cellClicked(location) {
    var cell = gBoard[location.i][location.j]
    cell.isShown = true
    renderCell(location, cell.minesAroundCount)
}

// Render the movement in DOM (location is an object like this - { i: 2, j: 7 })
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.classList.add('show')
    elCell.classList.remove('hide')
    elCell.innerHTML = checkCellType(value, true)
}