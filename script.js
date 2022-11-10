const ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const API_URL = 'https://api.datamuse.com/words?max=1000&sp=?????';

let rows = [];
let currentRow = 1;
let currentWord;
let currentWordScore;

let typingState = false;
let hintsLeft = 2;
let totalScore = localStorage.getItem("score") || 0;
totalScore = parseInt(totalScore);

class Row {
    constructor(element) {
        this.element = element
        this.id = parseInt(element.id.replace('row-', ''));
        this.tiles = this.getTilesInRow();
    }
    goToNextRow() {
        currentRow += 1;
        let nextRowObject = rows[currentRow - 1];
        nextRowObject.tiles.forEach((data) => {
            const element = data.element;
            element.removeAttribute("disabled");
        })
        goToNextInput(this.tiles[this.tiles.length-1].element.id)
    }
    verifyWord() {
        let correctLetters = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            let tileData = this.getTileDataFromIndex(i);
            let tileElement = tileData.element;
            let tileValue = tileElement.value;
            if (!currentWord.includes(tileValue)) {
                tileElement.classList.add('tile-wrong');
            } else if (currentWord[i] == tileValue) {
                correctLetters += 1;
                tileElement.classList.add('tile-right');
            } else {
                tileElement.classList.add('tile-warning');
            }
            tileElement.disabled = "true";
        }
        if (correctLetters < 5) {
            if (currentRow > 5) {
                return endGame("lose")
            }
            return this.goToNextRow();
        }
        totalScore += currentWordScore || 1;
        localStorage.setItem("score", totalScore);
        return endGame("win")
    }
    isFilled() {
        let filledTiles = 0;
        this.tiles.forEach((data) => {
            if (data.element.value != "") {
                filledTiles += 1;
            }
        })
        return filledTiles == this.tiles.length;
    }
    getTilesInRow() {
        let arrayOfTiles = [];
        let currentIndex = 0;
        Array.from(this.element.children).forEach((tileElement) => {
            const tileId = parseInt(tileElement.id);
            arrayOfTiles[currentIndex] = {
                key: tileId,
                element: tileElement
            }
            tileElement.value = ""
            tileElement.classList.remove("tile-right")
            tileElement.classList.remove("tile-wrong")
            tileElement.classList.remove("tile-warning")
            if (this.id != currentRow) {
                tileElement.disabled = "true";
            } else {
                tileElement.removeAttribute("disabled")
            }
            currentIndex += 1;
        })
        return arrayOfTiles;
    }
    getTileDataFromID(ID) {
        this.tiles.forEach((data) => {
            if (data.key == ID) {
                return data;
            }
        })
        return this.tiles[ID];
    }
    getTileDataFromIndex(Index) {
        return this.tiles[Index]
    }
    getLastTile() {
        return this.tiles[this.tiles.length-1]
    }
    getClosestClearTile() {
        let result;
        for (let i = 0; i < this.tiles.length; i++) {
            let tileData = this.getTileDataFromIndex(i);
            let tileElement = tileData.element;
            if (tileElement.value == "") {
                result = tileElement;
                break
            }
        }
        return result;
    }
}

async function getWordFromApi() {
    let response = await fetch(API_URL);
    let wordList = await response.json();

    const data = wordList[Math.floor(Math.random() * wordList.length - 1)];

    currentWordScore = data.score
    currentWord = data.word.toUpperCase();

    document.getElementById("word").innerText = currentWord;

    if (currentWord.includes(" ")) getWordFromApi();
}

async function iterateWithCallback(array, callback) {
    array.forEach((argument) => {
         callback(argument)
    })
}

function setTypingState(bool) {
    typingState = bool;
}

function addKey(key) {
    const currentRowObject = rows[currentRow - 1];
    const emptyTile = currentRowObject.getClosestClearTile();
    if (emptyTile) {
        emptyTile.value = key
    }
}

function goToNextInput(id) {
    let nextId = parseInt(id) + 1;
    let nextInputElement = document.getElementById(nextId);
    let currentRowElement = document.getElementById(`row-${currentRow}`)
    if (currentRowElement.id != `row-${currentRow}`) return console.log("Not on the same row.");
    if (!nextInputElement) return
    nextInputElement.focus();
    nextInputElement.select();
}

function goToPreviousInput(id) {
    let previousId = parseInt(id) - 1;
    previousId = previousId < 1 && 1 || previousId;
    let previousInputElement = document.getElementById(previousId);
    let currentRowElement = document.getElementById(`row-${currentRow}`)
    if (currentRowElement.id != `row-${currentRow}`) return console.log("Not on the same row.");
    if (!previousInputElement) return
    previousInputElement.focus();
    previousInputElement.select();
    setTimeout(() => {
        previousInputElement.focus();
        previousInputElement.select(); 
    }, 20);
}

function onChange(id, value) {
    if (value == "") {
        //goToPreviousInput(id);
    }
}

function clearLastTile() {
    const currentRowObject = rows[currentRow - 1];
    const currentTile = currentRowObject.getClosestClearTile();
    function clearTile(toClearTile, isLast) {
        function clear(tile) {
            tile.value = "";
            tile.innerHTML = "";
            tile.focus();
            tile.select();
        }
        let id = toClearTile.id;
        if (isLast) {
            console.log("is last");
            console.log(toClearTile.element);
            clear(toClearTile.element);
        } else {
            let previousId = parseInt(id) - 1;
            let previousTile = document.getElementById(previousId);
            if (previousTile) {
                let previousTileRow = previousTile.parentElement.id;
                console.log(typeof(previousTileRow), typeof(`row-${currentRow}`));
                if (previousTileRow.id != `row-${currentRow}`) return console.log("Not on the same row.");
                if (!previousTile) return
                clear(previousTile);
                return;
            }
            clear(toClearTile);
            return;
        }
    }
    if (currentTile) {
        clearTile(currentTile);
        return;
    }
    clearTile(currentRowObject.getLastTile(), true);
}

function buttonClicked(element) {
    const currentKey = element.innerHTML;
    const currentRowObject = rows[currentRow - 1];
    const emptyTile = currentRowObject.getClosestClearTile();
    console.log(currentKey);
    if (currentKey.includes("delete")) {
        clearLastTile();
    } else if (currentKey == "ENTER") {
        checkWord();
    } else {
        if (emptyTile) {
            addKey(currentKey)
            goToNextInput(emptyTile.id);
        }
    }
}

function checkWord() {
    const currentRowObject = rows[currentRow - 1];
    if (currentRowObject.isFilled()) {
        currentRowObject.verifyWord();
    } else {
        showNotification(`Row ${currentRow} is not filled.`)
    }
}

function keyDown(event) {
    const currentRowObject = rows[currentRow - 1];
    const keyName = event.key.toUpperCase();
    if (keyName == "ENTER") {
        checkWord();
    } else if (ALPHABET.includes(keyName) && !typingState) {
        const emptyTile = currentRowObject.getClosestClearTile();
        if (emptyTile) {
            emptyTile.focus();
            emptyTile.select();
        }
        addKey(keyName)
    } else if (keyName == "BACKSPACE" && typingState) {
        clearLastTile();
    } else if (keyName == "ARROWLEFT") {
        goToPreviousInput(typingState)
    } else if (keyName == "ARROWRIGHT") {
        goToNextInput(typingState)
    }
}

function loadGame() {
    rows = [];
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = `SCORE: ${totalScore}`;
    function createRow(rowElement) {
        rows.push(
            new Row(rowElement)
        )
    }
    getWordFromApi();
    const rowElements = Array.from(document.getElementsByClassName("column"));
    iterateWithCallback(rowElements, createRow)    
    document.addEventListener('keydown', keyDown);
}

function endGame(status) {
    const modal = document.getElementById("modal")
    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    resultElement.innerText = status;
    resultElement.style = `color: rgb(${status == "win" && '0, 255, 0' || '255, 0, 0'})`;
    scoreElement.innerText = `SCORE: ${totalScore}`;
    modal.style = "";
}

function restartGame() {
    currentRow = 1;
    const modal = document.getElementById("modal");
    modal.style = "visibility: hidden;";
    setTimeout(() => {
        loadGame();
        const firstTile = document.getElementById("1");
        firstTile.select();
        firstTile.focus();
    }, 100);
}

function showNotification(text, timeInSeconds = 2) {
    const notificationBox = document.getElementById("notification-box");
    notificationBox.innerText = text;
    notificationBox.style.bottom = "-4rem";
    setTimeout(() => {
        notificationBox.style.bottom = "-25rem";
    }, timeInSeconds * 1000);
}

function takeHint() {
    const totalHints = document.getElementById("total-hints");
    hintsLeft -= 1
    if (hintsLeft >= 0) {
        totalHints.innerText = `${hintsLeft} HINTS LEFT`
        showNotification(`Word contains the letter ${currentWord[Math.floor(Math.random() * 5)]}`)
        if (hintsLeft == 0) {
            totalHints.style.color = "rgb(255, 0, 0)";
        }
    }
}

function showScore() {
    showNotification(document.getElementById("score").innerText);
}