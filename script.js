document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const movesDisplay = document.getElementById('moves');
    const width = 8;
    const squares = [];
    let score = 0;
    let moves = 0;

    const candyColors = [
        'url(Candies/green.png)',
        'url(Candies/blue.png)',
        'url(Candies/red.png)',
        'url(Candies/yellow.png)',
        'url(Candies/purple.png)',
        'url(Candies/gray.png)'
    ];


    //create a board
    function createBoard() {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * candyColors.length); //gives a random number from 0 to 5
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    //Drag the candies

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let sqaureIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));


    function dragStart () {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id); //making sure that Id is being stored as a number
    }


    function dragOver (e) {
        e.preventDefault(); //prevents the function from making a default behavior
    }

    function dragEnter () {

    }

    function dragLeave () {
    }

    function dragDrop () {
        colorBeingReplaced = this.style.backgroundImage;
        sqaureIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged; // exchanging the colors
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced; //when we drop a square onto another, the latter gets the color of the one being dragged
        moves += 1;
        movesDisplay.innerHTML = moves; 
        check();
    }

    function dragEnd () {
        setInterval(check, 200);

        //defining a valid move as we cannot just switch any candy with any candy

        let validMoves = [
            squareIdBeingDragged -1, //square right before
            squareIdBeingDragged - width, //square right above as width = 8
            squareIdBeingDragged +1,
            squareIdBeingDragged + width
        ]

        let validMove = validMoves.includes(sqaureIdBeingReplaced); // includes is a built-in JS method. if the squareBeingReplaced's Id is included in this array (obeys one of the 4 rules), then the move is valid
        
        if (sqaureIdBeingReplaced && validMove) { //squareIdBeingReplaced in the if statement makes sure that we don't drop the square outside the grid
            sqaureIdBeingReplaced = null
        } else if (sqaureIdBeingReplaced && !validMove) {
            squares[sqaureIdBeingReplaced].style.backgroundImage = colorBeingReplaced; // if the move is not valid we give the square its original color
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged; //as above
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }    

    }


// drop candies once some have been cleared

function moveDown() {
    for (i = 0; i <= 55; i++) { //checking below every row
        if (squares[i + width].style.backgroundImage === '') {
            squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
            squares[i].style.backgroundImage = '';
        }
            //fill in the empty rows
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i)
        if (isFirstRow && squares[i].style.backgroundImage === '') {
            let randomColor = Math.floor(Math.random() * candyColors.length);
            squares[i].style.backgroundImage = candyColors[randomColor];
        }
        
    }
}




//Checking for matches

//checking for 5 the same colors in a row

function checkRowForFive() {
    for (i = 0; i <= 59; i++) { //we cannot go over 63
        let rowOfFive = [i, i+1, i+2, i+3, i+4];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55]; // these are two last squares in the row, if it would start there, the 3rd one goes to the other one
        if (notValid.includes(i)) continue; // 'continue keyword is usually used to break iteration and pick it up in the case a statement is not valid

        if (rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 5;
            scoreDisplay.innerHTML = score;
            rowOfFive.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}
//checkRowForThree();



//checking for 5 the same colors in a column
function checkColumnForFive() {
    for (i = 0; i <= 38; i++) { //we cannot go over 63
        let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        if (columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 5;
            scoreDisplay.innerHTML = score;
            columnOfFive.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}

//checking for 4 the same colors in a row

function checkRowForFour() {
    for (i = 0; i <= 60; i++) { //we cannot go over 63
        let rowOfFour = [i, i+1, i+2, i+3];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]; // these are two last squares in the row, if it would start there, the 3rd one goes to the other one
        if (notValid.includes(i)) continue; // 'continue keyword is usually used to break iteration and pick it up in the case a statement is not valid

        if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4;
            scoreDisplay.innerHTML = score;
            rowOfFour.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}
//checkRowForThree();



//checking for 4 the same colors in a column
function checkColumnForFour() {
    for (i = 0; i <= 39; i++) { //we cannot go over 63
        let columnOfFour = [i, i + width, i + width * 2, i + width *3];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 4;
            scoreDisplay.innerHTML = score;
            columnOfFour.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}


//checking for 3 the same colors in a row

function checkRowForThree() {
    for (i = 0; i <= 61; i++) { //we cannot go over 63
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]; // these are two last squares in the row, if it would start there, the 3rd one goes to the other one
        if (notValid.includes(i)) continue; // 'continue keyword is usually used to break iteration and pick it up in the case a statement is not valid

        if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.innerHTML = score;
            rowOfThree.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}
//checkRowForThree();



//checking for 3 the same colors in a column
function checkColumnForThree() {
    for (i = 0; i <= 47; i++) { //we cannot go over 63
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedColor = squares[i].style.backgroundImage;
        const isBlank = squares[i].style.backgroundImage === ''; //if the square doesn't have a color it is blank

        if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.innerHTML = score;
            columnOfThree.forEach(index => {
                squares[index].style.backgroundImage = ''; //if we have a match, all three squares become blank
            })
        }
    }
}

let check = function()  { // FOR LATER: ADD A BUTTON TO ACTIVATE IT (CHECK IN TETRIS) 
    checkColumnForFive()
    checkRowForFive()
    checkRowForFour() //checking for bigger first, as they are more important
    checkColumnForFour()
    checkRowForThree()
    checkColumnForThree()
    moveDown()
}


})