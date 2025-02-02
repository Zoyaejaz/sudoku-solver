"use strict";

document.getElementById("sudoku-board").addEventListener("keyup", function (event) {
    if (event.target && event.target.nodeName === "TD") {
        var validNum = /^[1-9]$/;
        var tdEl = event.target;
        if (tdEl.innerText.length > 0 && validNum.test(tdEl.innerText[0])) {
            tdEl.innerText = tdEl.innerText[0];
        } else {
            tdEl.innerText = "";
        }
    }
});

document.getElementById("solve-button").addEventListener("click", function () {
    var boardString = boardToString();
    var solution = SudokuSolver.solve(boardString);
    if (solution) {
        stringToBoard(solution);
    } else {
        alert("Invalid board!");
    }
});

document.getElementById("clear-button").addEventListener("click", clearBoard);

function clearBoard() {
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        tds[i].innerText = "";
    }
}

function boardToString() {
    var string = "";
    var validNum = /^[1-9]$/;
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        if (validNum.test(tds[i].innerText)) {
            string += tds[i].innerText;
        } else {
            string += "-";
        }
    }
    return string;
}

function stringToBoard(string) {
    var cells = string.split("");
    var tds = document.getElementsByTagName("td");
    for (var i = 0; i < tds.length; i++) {
        tds[i].innerText = cells[i] === "-" ? "" : cells[i];
    }
}

var SudokuSolver = (function () {
    function solve(boardString) {
        var boardArray = boardString.split("");
        if (boardIsInvalid(boardArray)) {
            return false;
        }
        return recursiveSolve(boardString);
    }

    function recursiveSolve(boardString) {
        var boardArray = boardString.split("");
        if (boardIsSolved(boardArray)) {
            return boardArray.join("");
        }
        var cellPossibilities = getNextCellAndPossibilities(boardArray);
        var nextUnsolvedCellIndex = cellPossibilities.index;
        var possibilities = cellPossibilities.choices;
        for (var i = 0; i < possibilities.length; i++) {
            boardArray[nextUnsolvedCellIndex] = possibilities[i];
            var solvedBoard = recursiveSolve(boardArray.join(""));
            if (solvedBoard) {
                return solvedBoard;
            }
        }
        return false;
    }

    function boardIsInvalid(boardArray) {
        return !boardIsValid(boardArray);
    }

    function boardIsValid(boardArray) {
        return allRowsValid(boardArray) && allColumnsValid(boardArray) && allBoxesValid(boardArray);
    }

    function boardIsSolved(boardArray) {
        return boardArray.every((cell) => cell !== "-");
    }

    function getNextCellAndPossibilities(boardArray) {
        for (var i = 0; i < boardArray.length; i++) {
            if (boardArray[i] === "-") {
                var existingValues = getAllIntersections(boardArray, i);
                var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(
                    (num) => !existingValues.includes(num)
                );
                return { index: i, choices: choices };
            }
        }
    }

    function getAllIntersections(boardArray, i) {
        return [...getRow(boardArray, i), ...getColumn(boardArray, i), ...getBox(boardArray, i)];
    }

    function allRowsValid(boardArray) {
        return [0, 9, 18, 27, 36, 45, 54, 63, 72]
            .map((i) => getRow(boardArray, i))
            .every(collectionIsValid);
    }

    function getRow(boardArray, i) {
        var start = Math.floor(i / 9) * 9;
        return boardArray.slice(start, start + 9);
    }

    function allColumnsValid(boardArray) {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8]
            .map((i) => getColumn(boardArray, i))
            .every(collectionIsValid);
    }

    function getColumn(boardArray, i) {
        return Array.from({ length: 9 }, (_, k) => boardArray[i + k * 9]);
    }

    function allBoxesValid(boardArray) {
        return [0, 3, 6, 27, 30, 33, 54, 57, 60]
            .map((i) => getBox(boardArray, i))
            .every(collectionIsValid);
    }

    function getBox(boardArray, i) {
        var boxCol = (Math.floor(i % 9 / 3)) * 3;
        var boxRow = Math.floor(i / 27) * 27;
        var start = boxCol + boxRow;
        return [0, 1, 2, 9, 10, 11, 18, 19, 20].map((offset) => boardArray[start + offset]);
    }

    function collectionIsValid(collection) {
        var seen = new Set();
        return collection.every((cell) => cell === "-" || !seen.has(cell) && seen.add(cell));
    }

    return { solve };
})();
