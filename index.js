currentMove = "X";
otherMove = "O";
lastCapture = 0;
gameOver = false;
player = "X";
computer = "O";
maxDepth = 10;
counter = 0;

function init() {
    board = document.getElementById("board");
    for (let i = 1; i <= 9; i++) {
        board.innerHTML += `<div class='cell' id='cell-${i}' data-cell>`;
    }
    cells = document.querySelectorAll('[data-cell]');
    cells.forEach(function(cell) {
        cell.innerHTML = " ";
        cell.addEventListener("click", () => {if (!gameOver) move(cell)});
    });
    document.getElementById("restart").addEventListener("click", function() {
        currentMove = "X";
        otherMove = "O";
        gameOver = false;
        lastCapture = 0;
        document.getElementById("winner").innerHTML = "";
        document.getElementById("current-move").innerHTML = `Current move: ${currentMove}`;
        cells.forEach((c) => {
            c.innerHTML = " ";
        });
    })
}

function move(cell) {
    if (currentMove == player) {
        if (cell == lastCapture) alert("You can't capture the cell your oppenent just took.");
        else if (cell.innerHTML == currentMove) {
            cell.innerHTML = currentMove + currentMove; 
            lastCapture = cell;
            nextMove();
        } 
        else if (cell.innerHTML == currentMove + currentMove) alert("You've already taken full control of that cell.");
        else if (cell.innerHTML == otherMove + otherMove) alert("Your opponent has already locked up that cell.") 
        else {
            cell.innerHTML = currentMove;
            lastCapture = cell;
            nextMove();
        }
        document.getElementById("current-move").innerHTML = `Current move: ${currentMove}`;
        checkWin();
    } else {
        let move = getMove();
        if (cells[move].innerHTML == computer) cells[move].innerHTML = computer + computer;
        else cells[move].innerHTML = computer;
        lastCapture = cells[move];
        nextMove();
        checkWin();
    }
    
}

function nextMove() {
    currentMove = currentMove == "X" ? "O" : "X";
    otherMove = currentMove == "X" ? "O" : "X";
    let currentState = [];
    for (let i = 0; i < 9; i++) {
        currentState.push(cells[i].innerHTML);
    }
    if (currentMove == computer && !terminalAndUtility(currentState)[0]) move();
}

function checkWin() {
    let currentState = [];
    for (let i = 0; i < 9; i++) {
        currentState.push(cells[i].innerHTML);
    }
    let termValue = terminalAndUtility(currentState);
    gameOver = termValue[0];
    let winner = termValue[1] == 1 ? "X" : termValue[1] == -1 ? "O" : "D";
    if (gameOver) document.getElementById("winner").innerHTML = `${winner == player ? "YOU WIN!" : winner == "D" ? "It's a tie!" : "Sorry, you lost."}`;
}

function spacePossession(s) {
    space = document.getElementById(`cell-${s}`);
    if (space.innerHTML == " ") return " ";
    return space.innerHTML[0];
}

function actions(state, lCapture) {
    let actions = [];
    for (let i = 0; i < 9; i++) {
        if (cells[i] != lCapture && state[i] != player + player && state[i] != computer + computer) actions.push(i);
    }
    return actions;
}

function getMove() { 
    // AI not complete, need to implement a heuristic function to evaluate any given position (output will be a decimal between -1 and 1)
    let initState = [];
    for (let i = 0; i < 9; i++) {
        initState.push(cells[i].innerHTML);
    }
    for (let targetScore = -1; targetScore <= 1; targetScore++) {
        for (let i = 0; i <= 8; i++) {
            if (actions(initState, lastCapture).includes(i) && maxVal(result(initState, i, computer), i, 0, player) == targetScore) {
                return i;
            }
        }
    }
}

function result(state, move, playerToMove) {
    newState = [...state];
    if (newState[move] == playerToMove) newState[move] == playerToMove + playerToMove;
    else newState[move] = playerToMove;
    return newState;
}

function terminalAndUtility(state) {
    winCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    for (const c of winCombinations) {
        currentPlayer = state[c[0] - 1][0];
        if (state[c[1] - 1][0] == state[c[2] - 1][0] && state[c[1] - 1][0] == currentPlayer && currentPlayer != " ") {
            return [true, currentPlayer == "X" ? 1 : -1];
        }
    }
    let emptyFlag = false;
    state.forEach((c) => {
        if (c == " ") emptyFlag = true;
    })
    if (!emptyFlag) return [true, 0];
    return [false, 0];
}

function maxVal(state, lCapture, depth, playerToMove) {
    let termValue = terminalAndUtility(state);
    if (termValue[0]) return termValue[1]; counter++;
    if (depth > maxDepth) return 0; 
    let v = -2;
    for (action of actions(state, lCapture)) {
        v = Math.max(v, minVal(result(state, action, playerToMove), cells[action], ++depth, playerToMove == computer ? player : computer));
    }
    return v;
}

function minVal(state, lCapture, depth, playerToMove) {
    let termValue = terminalAndUtility(state);
    if (termValue[0]) return termValue[1]; counter++;
    if (depth > maxDepth) return 0; 
    let v = 2;
    for (action of actions(state, lCapture)) {
        v = Math.min(v, maxVal(result(state, action, playerToMove), cells[action], ++depth, playerToMove == computer ? player : computer));
    }
    return v;
}
