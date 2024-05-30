// Display/UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js"  //importing the fuctions from the minesweeper.js file 

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES) //this board class is also added to the Html so that we can style and display it 

const boardElement = document.querySelector(".board") //Selects the HTML element with the class "board" to which the tiles will be appended.
//Selects HTML elements that will display the number of mines left and the game outcome messages
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

board.forEach(row => {  // Iterates through each row of the board.
  row.forEach(tile => { //Iterates through each tile in the row.
    boardElement.append(tile.element) //Appends the HTML element of each tile to the board.
    tile.element.addEventListener("click", () => { //Reveals the tile when clicked, then checks if the game has ende
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", e => { //Marks/unmarks the tile when right-clicked, then updates the display of mines left.
      e.preventDefault() // prevents the right click menu showing up on the board 
      markTile(tile)
      listMinesLeft()
    })
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE) //Sets a CSS custom property --size to control the size of the board in the CSS.
minesLeftText.textContent = NUMBER_OF_MINES //Initializes the text content of the element displaying the number of mines left.

function listMinesLeft() {
 //We are reducing our board to a single variable known as the count variable 
  const markedTilesCount = board.reduce((count, row) => { //We're looking at every row in the Minesweeper board.
    // For each row, we're counting how many tiles are marked (the ones the player has flagged as potential mines).
    
    return (
      count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length //counts the number of tiles in a row that are marked.
    ) //The count variable keeps track of this total count.
  }, 0) // we are defaulting the count at 0, so it starts at 0 and then keep adding marked tiles by analysing each rows 

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount //After calculating the total count of marked tiles,
  // it subtracts this count from the total number of mines (NUMBER_OF_MINES).
  //The result represents the number of mines that are yet to be marked.
  
} 

function checkGameEnd() {
  const win = checkWin(board) //Checks if the player has won the game.
  const lose = checkLose(board)// Checks if the player has lost the game.

  if (win || lose) { //If the game has ended (either win or lose), it adds event listeners to the game board to stop further interactions
    boardElement.addEventListener("click", stopProp, { capture: true }) //Stops click events on the game board to prevent further tile reveals
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  } // Stops right-click events on the game board to prevent further tile marking/unmarking

  if (win) {
    messageText.textContent = "You Win" //If the player has won, it updates the message text to display "You Win."
  }
  if (lose) { //Updates the message text to display "You Lose."
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile) //calling the mark tile fuction in which marked tiles become unmarked.
        if (tile.mine) revealTile(board, tile)
      }) //Umarks any tiles that were previously marked.
      //Reveals all mines on the board using the revealTile function.
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}

