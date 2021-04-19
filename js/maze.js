// ========== MAZE GAME ===========
var box = document.getElementById("maze");
var paper = new Raphael(box);

// modal to alert when the game ends 
var modal = document.getElementById('mazeModal');
var span = document.getElementsByClassName("mazeClose")[0];

var direction = 0;
var map;
// ======================================================================

// maze algorithm taken from here https://github.com/dstromberg2/maze-generator
/*
The generated maze is defined by a multidimensional array consisting of y and x coordinates, 
followed by definitions for the walls of each selected cell. The walls are defined using 
CSS order, which is [Top, Right, Bottom, Left], where 0 defines the presence of a wall, and 
1 defines no wall.

So if the first cell in the maze is defined as maze[0][0][0,1,1,0], there would be a wall on 
the top and the left of that particular cell, with openings on the right and bottom.

y coordinates are used first in the array, and x is second. This is to facilitate 
the display of the maze in HTML, as horizontal rows need to be established first, followed by 
each vertical cell in the row.
*/
function newMaze(x, y) {
    // Establish variables and starting grid
    var totalCells = x*y; // x (vertical) and y (horizontal) are the dimensions of the maze (length and width)
    var cells = []; // array for the cells
    var unvis = []; 
    for (var i = 0; i < y; i++) { 
        // so the first cell in the maze is [0][0],
        // second cell, horizontally, would be [0][1], and so on
        // the first cell in the second vertical row would be [1][0], and so on

        cells[i] = []; // creating a two dimensional array 
        unvis[i] = []; 

        for (var j = 0; j < x; j++) {
            // the third array is used to define where the walls will be on that particular cell 
            // e.g. [1, 1, 1, 1] means that the cell has no walls on the top, right, left, and bottom
            // [1, 0, 1, 0] means that the top and left have a wall whereas the right and bottom of that cell have no walls

            // start by making all the cells in the maze walls 
            cells[i][j] = [0,0,0,0]; // creating a three dimensional array
            unvis[i][j] = true; // initialising a new maze so all cells are unvisited, true
        }
    }

    // Set a random position to start from
    var currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
    var path = [currentCell];
    
    // console.log(unvis[currentCell[0]][currentCell[1]]); == true
    unvis[currentCell[0]][currentCell[1]] = false;
    var visited = 1;
    
    // Loop through all available cell positions
    while (visited < totalCells) {
        // Determine neighboring cells
        var pot = [[currentCell[0]-1, currentCell[1], 0, 2],
                [currentCell[0], currentCell[1]+1, 1, 3],
                [currentCell[0]+1, currentCell[1], 2, 0],
                [currentCell[0], currentCell[1]-1, 3, 1]];
        var neighbors = [];
        
        // Determine if each neighboring cell is in game grid, and whether it has already been checked
        for (var l = 0; l < 4; l++) {
            if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
        }
        
        // If at least one active neighboring cell has been found
        if (neighbors.length) {
            // Choose one of the neighbors at random
            next = neighbors[Math.floor(Math.random()*neighbors.length)];
            
            // Remove the wall between the current cell and the chosen neighboring cell
            cells[currentCell[0]][currentCell[1]][next[2]] = 1;
            cells[next[0]][next[1]][next[3]] = 1;
            
            // Mark the neighbor as visited, and set it as the current cell
            unvis[next[0]][next[1]] = false;

            visited++; // increase visited count 
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        // Otherwise go back up a step and keep going
        else {
            currentCell = path.pop();
        }
    }
    return cells;
}


// ======================================================================
// These functions to draw wall, character, end, and path use Raphael svg graphics taught in class
function drawWall(xPos, yPos) {
    var path = paper.path("M5,5 L5,50 L50,50 L50,5Z");
    path.attr({
        "fill": "#ff00c1",
        "stroke": "white",
        "stroke-width": "3px",
        "fill": "black"
    });
    path.translate(xPos, yPos);
    document.querySelector('svg').appendChild(path.node);
}

function drawChar(xPos, yPos) {
    var path = paper.path("M15,15 L15,40 L40,40 L40,15Z");
    path.attr({
        "id": 'char',
        'fill': '#ff00c1'
    });
    path.translate(xPos, yPos);
    document.querySelector('svg').appendChild(path.node);
}

function drawEnd(xPos, yPos) {
    var path = paper.path("M11.201,2.183 L11.201,47.653 L15.425,47.479 L15.433,21.109 L46.683,10.47 L11.201,2.183 Z");
    path.attr({
        "id": "end",
        "fill": "#ff00c1"
    });
    path.translate(xPos, yPos);
    document.querySelector('svg').appendChild(path.node);
}

function drawPath(xPos, yPos) {
    var path = paper.path("M5,5 L5,50 L50,50 L50,5Z");
    path.attr({
        "fill": "#00bbbb",
        "stroke": "#00bbbb"
    });
    path.translate(xPos, yPos);
    document.querySelector('svg').appendChild(path.node);
}


// ======================================================================
// This function creates and returns an array of 9 arrays which make up the columns of the maze 
// it creates this from a maze array 
function findMazeMap(mazeArray) {

    // the original mazeArray length is 4 which is too small 
    // so expandedSize uses a 2n + 1 equation to enlarge the size of the map (9 x 9)
    var expandedSize = 2*mazeArray.length + 1;
    var newRow;
    var newCol;
    var newDirection;

    // the JavaScript array .map() method calls the provided function once for each element in an array, in order.
    // variable map is a (2n+1) by (2n+1) array filled with 0 
    var map = Array(expandedSize).fill().map(() => Array(expandedSize).fill(0));

    // fill middle squares with 1's so that there can be a proper path
    for (var i = 0; i < mazeArray.length; i++) {
        for (var j = 0; j < mazeArray[i].length; j++) {
            var newRow = i * 2 + 1;
            var newCol = j * 2 + 1;
            map[newRow][newCol] = 1;  
        }
    }
  
    // fill side squares with 1's
    // creating the path by checking the mazeArray 
    var pathArray = [];
    for(var i = 0; i < mazeArray.length; i++){
        for(var j = 0; j < mazeArray[i].length; j++) {
            if (mazeArray[i][j][0] == 1) {
              pathArray.push([i,j,0]);
            }
            if (mazeArray[i][j][1] == 1) {
              pathArray.push([i,j,1]);
            }
            if (mazeArray[i][j][2] == 1) {
              pathArray.push([i,j,2]);
            }
            if (mazeArray[i][j][3] == 1) {
              pathArray.push([i,j,3]);
            }

            // for (var k = 0; k < mazeArray[i][j].length; k++) {
            //     console.log(mazeArray[i][j][k]);
            // }
        }
    }

    // path array is an array containing 30 arrays which contain 3 ints (0, 1, 2, or 3)
    console.log(pathArray);

    // determine where openings exist
    for(var i = 0; i < pathArray.length; i++) {
        newRow = pathArray[i][0] * 2 + 1;
        newCol = pathArray[i][1] * 2 + 1;

        newDirection = pathArray[i][2];
 
        if (newDirection % 2 === 1) {
            if (newDirection == 1) {
                newCol += 1;
            } else {
                newCol -= 1;
            }
        } else{
            if (newDirection == 0) {
                newRow -= 1;
            } else {
                newRow += 1;
            }
        }
        map[newRow][newCol] = 1; 
    }

    // map is made up of 9 arrays, each array has 9 ints (0 to represent wall or 1 to represent path)
    // the first array in map (index 0) is the leftmost column in the maze, 
    // the last array in map (index 8) is the rightmost column in the maze
    console.log("map: ");
    console.log(map);
    return map; // returns a map array 
}


// draws the maze paths and walls based on map array
function drawMaze(map){
    var xPos = 50;
    var yPos = 50;

    for(var i = 0; i < map.length; i++) {
        for(var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1) { 
                // draw path
                drawPath(xPos*i, yPos*j);
            } else { 
                // draw wall
                drawWall(xPos*i, yPos*j);
            }
        }
    }
}


// draws character at start and end point
// start is always at 0,0
// end is always at maze size, maze size
function initStartEnd(map){
    var startXPos = 50;
    var startYPos = 50;
    var endXPos = (map.length - 2) * 50;
    var endYPos = (map.length - 2) * 50;
    drawChar(startXPos, startYPos);
    drawEnd(endXPos, endYPos);
}


// checks to see if move is valid and moves piece if valid
var currX;
var currY;
function moveChar(direction) {
    var validMove = 0;
    var tempCurrX = currX;
    var tempCurrY = currY;
    var startXPos = 50;
    var startYPos = 50;
    var xPos;
    var yPos;

    // change the tempCurrX and tempCurrY depending on keyboard direction/arrow press
    if (direction == 'left') {
        tempCurrX -= 1;
    } else if (direction == 'right') {
        tempCurrX += 1;  
    } else if (direction == 'up') {
        tempCurrY -= 1;
    } else if (direction == 'down') {
        tempCurrY += 1;
    }

    // check to see if valid move
    if (map[tempCurrX][tempCurrY] == 1) {
        console.log("valid move");
        // update currX and currY
        xPos = currX * 50;
        yPos = currY * 50;

        // erase previous location
        drawPath(xPos, yPos);
        currX = tempCurrX;
        currY = tempCurrY;
        
        // move piece, update to new location
        xPos = currX * 50;
        yPos = currY * 50;
        drawChar(xPos, yPos);
    
        // check if game has ended
        if (currY == endY && currX == endX) {
            modal.style.display = "block";
        }
    }  
}


// ======================================================================
// moving mechanics
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            // console.log("left!");
            direction = 'left';
            break;
        case 38:
            // console.log("up!");
            direction = 'up';
            break;
        case 39:
            // console.log("right!");
            direction = 'right';
            break;
        case 40:
            // console.log("down!");
            direction = 'down';
            break;
    }
    if (direction != 0){
        moveChar(direction);
    }
};


// ======================================================================
// to start the game
function start() {
    // determines how many cells will be in the maze, right now optimised for this value to be 4
    var sizeArray = 4; 

    // putting all the functions together, 
    // a mazeArray is created using the newMaze method which takes in the sizeArray as arguments
    var mazeArray = newMaze(sizeArray, sizeArray);
    console.log("mazeArray: ")
    console.log(mazeArray);
    // mazeArray is an array of 4 arrays, each contianing 4 ints (0 or 1)

    // the mazeArray will be used to create the maze map
    map = findMazeMap(mazeArray);

    // the draw maze function will begin to render the maze with walls and paths based on the map (of arrays of 1s and 0s)
    drawMaze(map);

    // the current/starting position of the player 
    currX = 1;
    currY = 1;
    endX = map.length - 2;
    endY = map.length - 2;
    initStartEnd(map);
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    start();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        start();
    }
}

// Runs start on window load
window.onload = function() {
    start();
};

// ======= END OF MAZE GAME ========