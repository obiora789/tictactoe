let playerName = prompt('Please Enter your Name');
let human = prompt("Choose 'X' or 'O'");
let computer;
let originalBoard;
let humanScore = 0;
let computerScore = 0;
let winningScore = 20;

(function playerRegex() {
    let regex = /^[A-Za-z]+$/ig;
    let result = regex.test(playerName);
    if (result) {
        choosePlayer();
        return true;
    }else {
        alert("Enter your Name to Play");
        document.getElementById('rewrite').innerHTML = "Enter your Name";
        return false;
    }
})();


function choosePlayer() {
    document.querySelector('body').style.background ="#8AF7F3";
    if (human === 'X') {
        computer = 'O';
    }else if (human === 'O'){
        computer ='X';
    }else {
        document.querySelector('body').innerText = "CHOOSE 'X' OR 'O'";
    }
}


const winArrays = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
    ];
const cells = document.querySelectorAll(".cell");

startGame();





function startGame() {
    document.querySelector(".endgame").style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    
    if (humanScore == winningScore || computerScore == winningScore) {
            humanScore = 0;
            let strScore = playerName+"'s Score: "+humanScore; 
            document.getElementById('scoreobi').innerHTML = strScore;
            computerScore = 0;
            let compScore = "Computer Score: "+computerScore;
            document.getElementById('scorecomputer').innerHTML = compScore;
        }
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
      turn(square.target.id, human); 
    if (!checkTie()) {
        turn(bestChoice(), computer);
            }
        }
    }
    

function turn(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let wonGame = checkWin(originalBoard, player);
    if (wonGame) {
        gameOver(wonGame);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a,e,i) => (e === player)? a.concat(i) : a, []);
    let wonGame = null;
    for (let [index, win] of winArrays.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            wonGame = {index: index, player: player};
            break;
        }
    }
    return wonGame;
}

function gameOver(wonGame) {
    for(let index of winArrays[wonGame.index]) {
       document.getElementById(index).style.backgroundColor = wonGame.player == human ? "#FFBD4C": "#8C97FF";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    
    if (wonGame.player == human) {
        humanScore+=5;
        let strScore = playerName+"'s Score: "+humanScore; 
        document.getElementById('scoreobi').innerHTML = strScore;
        displayWinner(playerName+" Won!!!");     
    }else {
        computerScore+=5;
        let compScore = "Computer Score: "+computerScore;
        document.getElementById('scorecomputer').innerHTML = compScore;
        displayWinner("Computer Won!!");
        }
        if (humanScore == winningScore || computerScore == winningScore) {
            document.getElementById('restart').innerHTML = "Game Over! Restart";
        } else {
            document.getElementById('restart').innerHTML = "Replay";
        }
        if (humanScore == winningScore) {
            displayWinner(playerName+" Won This Round!!!"); 
        }else if (computerScore == winningScore){
            displayWinner("Computer Won This Round!!!");
        }else {
            return;
        }
        
    }


function displayWinner(who) {
    document.querySelector('.endgame').style.display = "block";
    document.querySelector('.endgame .text').innerText = who;
}

function emptySpots() {
    return originalBoard.filter(s => typeof s == 'number');
}

function bestChoice() {
    return minimax(originalBoard, computer).index;
}

function checkTie() {
    if (emptySpots().length === 0) {
        if(checkWin(originalBoard,human)) {
            displayWinner(playerName+" Won!!!");
        }else {
            for (i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
            displayWinner("Tie Game");
            }
         
        }
        
        return true;
    } else {
        return false;
    }
}

function minimax(newBoard, player) {
    let availableSpots = emptySpots(newBoard);
    if (checkWin(newBoard, player)) {
        return {score: -10};
    }else if (checkWin(newBoard, computer)) {
        return {score: 20};
    }else if (availableSpots.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;
        if (player == computer) {
            let result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, computer);
            move.score = result.score;
        }
        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if (player === computer) {
        let bestScore = -10000;
        for (i=0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else {
        let bestScore = 10000;
        for (i=0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}