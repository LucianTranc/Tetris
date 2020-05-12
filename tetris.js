/*
Tetris Game created by Lucian Tranc 2020
*/


const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(24,24);
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "white";
context.font = "4px Calibri";
context.fillText("TETRIS", 1, 4);
context.font = "1px Calibri";
context.fillText("Made By: Lucian Tranc", 1, 5);
context.fillText("Controls:", 1, 16);
context.fillText("Left Arrow: Move left", 1, 17);
context.fillText("Right Arrow: Move right", 1, 18);
context.fillText("Down Arrow: Move down", 1, 19);
context.fillText("Up Arrow: Rotate Piece", 1, 20);
context.fillText("Spacebar: Drop Piece", 1, 21);

var thePlayer, intervalVar, gravityTimer = 0, landedBlock, running = false, board, score = 0, lines = 0;
const gravityRatio = 20;

class block {
    constructor(random){
        if (random == 1) {
            this.shape = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ]
            this.color = "yellow";
            this.id = random;
        }
        else if (random == 2) {
            this.shape = [
                [0, 1, 1],
                [0, 1, 1],
                [0, 0, 0]
            ]
            this.color = "red";
            this.id = random;
        }
        else if (random == 3) {
            this.shape = [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ]
            this.color = "blue";
            this.id = random;
        }
        else if (random == 4) {
            this.shape = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1],
            ]
            this.color = "pink";
            this.id = random;
        }
        else if (random == 5) {
            this.shape = [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ]
            this.color = "cyan";
            this.id = random;
        }
        else if (random == 6) {
            this.shape = [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ]
            this.color = "green";
            this.id = random;
        }
        else if (random == 7) {
            this.shape = [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
            this.color = "orange";
            this.id = random;
        }
    }
}

class player {
    constructor(block) {
        this.block = block;
        if (this.block.id == 1 || this.block.id == 3 || this.block.id == 4 || this.block.id == 7)
            this.position = {x: 5, y: 1};
        else
            this.position = {x: 5, y: 2};
    }
}


document.getElementById("tetris").onmousedown = function() {

    board = [
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ]
    
    gravityTimer = 0;
    score = 0;
    lines = 0;

    if (running) {
        clearInterval(intervalVar);
        running = false;
    }
    startGame();

}

document.onkeydown = function(event) {

    if (event.keyCode == 37) {//left
        if (checkCollision("x", -1, thePlayer.block.shape))
            thePlayer.position.x -= 1;
    }
    if (event.keyCode == 38 && thePlayer.block.id != 2) {//up
        var rotated = rotate();
        if (checkCollision("x", 0, rotated))
            thePlayer.block.shape = rotated;
    }
    if (event.keyCode == 39) {//right
        if (checkCollision("x", 1, thePlayer.block.shape))
            thePlayer.position.x += 1;
    }
    if (event.keyCode == 40) {//down
        if (checkCollision("y", 1, thePlayer.block.shape))
            thePlayer.position.y += 1;
    }
    if (event.keyCode == 32) 
        dropCurrentBlock();
}


function dropCurrentBlock() {

    while (checkCollision("y", 1, thePlayer.block.shape))
        thePlayer.position.y += 1;

    gravityTimer = gravityRatio - 1;

}

//transpose + reverse = rotate
//(make all rows cols and all cols rows), (flip the matrix along the center vertical axis)

function rotate() {

    var length = thePlayer.block.shape.length;
    var transpose = new Array(length);
    var rotated = new Array(length);

    for (var i = 0; i < length; i++) {
        transpose[i] = new Array(length);
        rotated[i] = new Array(length);
    }

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) 
            transpose[j][i] = thePlayer.block.shape[i][j];
    }

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) 
            rotated[i][j] = transpose[i][length-j-1];
    }

    if (thePlayer.block.id == 5 || thePlayer.block.id == 6) {
        if (rotated[0][0] == 0 && rotated[0][1] == 0 && rotated[0][2] == 0) {
            rotated[0] = rotated[1];
            rotated[1] = rotated[2];
            rotated[2] = [0,0,0];
        }
    }

    if (thePlayer.block.id == 7 &&  rotated[0][2] == 1 && rotated[1][2] == 1 &&
                                    rotated[2][2] == 1 && rotated[3][2] == 1) {

        rotated = [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    }

    return rotated;

}

//collision is checked by taking the requested movement of the player, either rotation or shifting,
//and then checking if the new position will interfere with the current blocks that have been placed on the board
//or the walls

function checkCollision(direction, magnitude, newPosition) {

    
    var length = thePlayer.block.shape.length;
    
    var reqy = thePlayer.position.x;
    var reqx = thePlayer.position.y;
    
    if (direction == "x") 
    reqy += magnitude;
    else if (direction == "y")
    reqx += magnitude;

    var stateOfBoard = new Array(length);
    
    for (var i = 0; i < length; i++) {
        stateOfBoard[i] = new Array(length);
        for (var j = 0; j < length; j++) 
            stateOfBoard[i][j] = board[reqx+i][reqy+j];
        
    }

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            if (newPosition[i][j] == 1 && stateOfBoard[i][j] != 0) 
                return false
        }
    }
    return true;
}


function startGame() {
    running = true;
    thePlayer = new player(new block(randomNumber(7)));
    intervalVar = setInterval(updateScreen, 10);
}

function randomNumber(n) {
    return Math.floor(Math.random()*n)+1
}

function drawBoard(board) {
    for(var i = 0; i < 22; i++) {
        for (var j = 0; j < 14; j++) {
            if (board[i][j] == 0)
                context.fillStyle = "black";
            if (board[i][j] == 1) 
                context.fillStyle = "yellow"; 
            if (board[i][j] == 2) 
                context.fillStyle = "red";
            if (board[i][j] == 3) 
                context.fillStyle = "blue";
            if (board[i][j] == 4) 
                context.fillStyle = "pink";
            if (board[i][j] == 5) 
                context.fillStyle = "cyan";
            if (board[i][j] == 6) 
                context.fillStyle = "green";
            if (board[i][j] == 7) 
                context.fillStyle = "orange";
            if (board[i][j] == -1) 
                context.fillStyle = "#fdffd9";

            context.fillRect(j, i, 1, 1);
        }
    }
    context.font = "1px Calibri";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 2, 21);
    context.fillText("Lines: " + lines, 8, 21);
}

function gravity() {

    var before = thePlayer.position.y
    if (checkCollision("y", 1, thePlayer.block.shape))
            thePlayer.position.y += 1;
    if (before == thePlayer.position.y)
        return true;
    else 
        return false;
}

function checkIfLanded() {

    var bottom = false;
    gravityTimer++;

    if (gravityTimer%gravityRatio == 0) {
        bottom = gravity();
    }

    return bottom;
}

function updateScreen() {
    
    if (checkIfLanded()) {
        if (isOver()) {
            clearInterval(intervalVar);
            context.fillStyle = '#000';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "white";
            context.font = "2px Calibri";
            context.fillText("Game Over", 1, 11);
            context.font = "1px Calibri";
            context.fillText("Score: " + score, 1, 12);
            context.fillText("Lines: " + lines, 1, 13);
            context.fillText("Click to try again", 1, 21);
            return;
        }
        landedBlock = thePlayer;
        thePlayer = new player(new block(randomNumber(7)));
        updateBoard();
        var linesToClear = checkForLines();
        linesToClear.sort();
        if (linesToClear.length > 0) {
            lines += linesToClear.length;
            if (linesToClear.length == 1)
                score += 40;
            else if (linesToClear.length == 2)
                score += 100;
            else if (linesToClear.length == 3)
                score += 300;
            else if (linesToClear.length == 4)
                score += 1200;
            setInterval(lineAnimation(linesToClear), 10000);
            linesToClear.forEach(clearLines);
        }
        linesToClear = [];
    }
    drawBoard(board);
    drawBlock(thePlayer.block.shape, thePlayer.position, thePlayer.block.color);
}

function lineAnimation(linesToClear) {
    context.fillStyle = "white";
    context.fillRect(5, 5, 4, 4);
}

function isOver() {
    if (thePlayer.position.x == 5 && (thePlayer.position.y == 1 || thePlayer.position.y == 2))
        return true;
}

function clearLines(lineToClear) {
    for (var i = lineToClear; i > 2; i--) {
        for (var j = 2; j < 12; j++)
            board[i][j] = board[i-1][j];
    }
}

function checkForLines() {

    var linesToClear = new Array();

    for (var i = 19; i > 2; i--) {
        var line = true;
        for (var j = 2; j < 12; j++) {
            if (board[i][j] == 0)
                line = false;
        }

        if (line)
            linesToClear.push(i)

    }

    return linesToClear;

}

function updateBoard() {

    var shapeLength = landedBlock.block.shape.length;
    var x = landedBlock.position.x;
    var y = landedBlock.position.y;
    
    var k = 0, p = 0;
    for(var i = y; i < shapeLength + y; i++) {
        p = 0;
        for (var j = x; j < shapeLength + x; j++) {
            if (landedBlock.block.shape[k][p] == 1) 
                board[i][j] = landedBlock.block.id;
            p++;
        }
        k++;
    }


}

function drawBlock(matrix, offset, color) {    
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !==0) {
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
        
    });
}


