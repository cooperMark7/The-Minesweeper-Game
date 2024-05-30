// Logic

export const TILE_STATUSES = { // titlestatus is an object that contains these constants (data status)
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

export function createBoard(boardSize, numberOfMines) { // export makes it usable in other parts of the code 
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines) //Calls a function getMinePositions to get an array of random mine positions.

  for (let x = 0; x < boardSize; x++) {
    const row = [] //creating the row 
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div") //Creates a new HTML div element for each tile.
      element.dataset.status = TILE_STATUSES.HIDDEN //makes all the tiles hidden by default.

      const tile = { //creating a tile 
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })), // A boolean indicating whether the tile is a mine or not.
        //it is determined by checking if the tile's position matches any mine positions.
        //it does this by checking which of the tiles coordinated matchs with the getminepositions coordinates, the matched ones are the mine tiles 
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }

      row.push(tile) // adding the tile to the row  (at the end of the array)
    }
    board.push(row) //adding the row containg tiles onto the board 
  }

  return board
}
//This function first checks if the tile is neither hidden nor already marked. If the tile is revealed, do nothing. 
//If the tile is marked, unmark it; otherwise, mark it. This function helps the player keep track of tiles they suspect might contain a mine.
export function markTile(tile) {
  if ( //Checks if the tile is not hidden or already marked. If it's revealed, do nothing
    tile.status !== TILE_STATUSES.HIDDEN && 
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return
  }
//Toggles between marking and unmarking a tile. If the tile is already marked, unmark it; otherwise, mark it.
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) { //}: If the tile is not hidden, do nothing.
    return
  }

  if (tile.mine) { 
    tile.status = TILE_STATUSES.MINE //}: If the tile is a mine, set its status to "mine" and return.
    return
  } 
//If the tile is not a mine, set its status to "number."
  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile) //Get an array of adjacent tiles.
  const mines = adjacentTiles.filter(t => t.mine) //Filter out the adjacent tiles that are mines.
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length //Adding the number to the tile,the number of adjacent mines to that tile 
  } //If there are no nearby mines, recursively reveal adjacent tiles. 
  //If there are nearby mines, display the number of mines around the current tile.
}
// as long as only the unrevealed tiles are mines either be marker or hidden we would win 
export function checkWin(board) {
  //we are checking for every row on the board and every tile onto the row 
  return board.every(row => {
    return row.every(tile => {
      return (

        /*if the tile is a number(revealed) || (or) a mine and it meets the following criteria of either being hidden or marked*/ 
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine && // the mines can be either marker or hidden 
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      )
    })
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
       // Reveals all marked tiles and mines when the game is lost
      return tile.status === TILE_STATUSES.MINE
    })
  })
}

function getMinePositions(boardSize, numberOfMines) { //This function generates random mine positions, ensuring no duplicates.
  const positions = []  // This initializes an empty array called positions to store the positions where mines will be placed

  while (positions.length < numberOfMines) { //This is a loop that continues until the desired number of mines (numberOfMines) is reached.
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }
    //Inside the loop, a new position object is created with random x and y coordinates using the randomNumber function. 
    //These coordinates represent a potential position for a mine on the Minesweeper board.

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }//will only push it if it unique coordinate and will skip this if it is not uique and has been generated before;
    //This checks if the generated position is not already in the positions array.
    // The positionMatch function is used to perform this check. If the position is unique, it is added to the positions array.
  }

  return positions
}

function positionMatch(a, b) { //This simple function returns true if the x and y properties of two positions (a and b) are equal, 
  //indicating that the positions match.
  return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)

  // math.floor = (Converts it into an integer) 
}
//}): The function takes two arguments - the game board (board) and an object with x and y coordinates representing the position of a tile on the board.
function nearbyTiles(board, { x, y }) {
  const tiles = [] //Initializes an empty array called tiles to store the tiles that are adjacent to the specified position.

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    /*The function uses nested loops to iterate through tiles in a 3x3 grid centered around the specified position. 
  The loops iterate over xOffset and yOffset, where each combination represents a relative position to the original tile. */

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset] 
      //For each combination of xOffset and yOffset, 
      //it calculates the coordinates of the adjacent tile relative to the original tile ({ x, y }). 
      //The use of ?. ensures that if the calculated tile position is outside the board boundaries, 
      //it returns undefined. This prevents potential errors when accessing tiles that don't exist.
      
      if (tile) tiles.push(tile) //If the calculated tile position is within the board boundaries (i.e., not undefined), 
      //it pushes the tile object into the tiles array.

    }
  }

  return tiles
}
