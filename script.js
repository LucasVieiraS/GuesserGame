let currentRow = 1;
let isFocus = false;

getWordFromAPI();
clearTiles();

document.addEventListener('keydown', (event) => {
    return keyEvent(event.key)
});

async function getWordFromAPI() {
    const url = 'https://api.datamuse.com/words?max=1000&sp=?????';

    let response = await fetch(url);
    let wordList = await response.json();

    word = wordList[Math.floor(Math.random() * wordList.length)].word.toUpperCase();
    document.getElementById('word').innerText = word;

    if (word.includes(' ')) getWordsFromAPI();

    return word;
}

function goToNextInput(currentId) {
    let nextId = currentId + 1;
    let nextInput = document.getElementById(nextId);
    if (nextInput) {
        let isNextRow = nextId > currentRow * 5;
        nextInput.focus();
        nextInput.select();
        console.log(nextInput)
    }
}

function inputChanged(element) {
    let currentId = parseInt(element.id);
    let keyTyped = element.value;
    console.log(currentId);
    console.log(keyTyped);
    goToNextInput(currentId);
}

function updateRows() {
    currentRow += 1;
    goToNextInput(currentRow * 5);
}

function isRowComplete() {
    let inputsFilled = 0;
    Array.from(document.querySelectorAll('.tile')).forEach(function(element) {
        const id = parseInt(element.id);
        if (id > currentRow * 5 && id <= (currentRow * 5) + 5) {
            console.log(element.innerText == "")
            inputsFilled += element.innerText != "" && 1 || 0;
        }
    });
    console.log(inputsFilled)
    return inputsFilled >= 5;
}

function retrieveWord() {
    let word = "";
    Array.from(document.querySelectorAll('.tile')).forEach(function(element) {
        if (parseInt(element.id) >= currentRow * 5) {
            word += element.innerHTML;
        }
    });
    return word;
}

function verifyWord() {
    let countId = 0;
    Array.from(document.querySelectorAll('.tile')).forEach(function(element) {
        if (parseInt(element.id) >= currentRow * 5) {
            countId += 1;
            let currentLetter = document.innerHTML;
            let isInWord = WORD_OF_THE_DAY.includes(currentLetter);
            let indexOfLetter = WORD_OF_THE_DAY.indexOf(currentLetter);
            if (isInWord) {
                if (indexOfLetter == countId) {
                    element.classList.add("tile-right");
                } else {
                    element.classList.add("tile-warning");
                }
            } else {
                element.classList.add("tile-wrong");
            }
        }
    });
    return updateRows();
}

function setFocus(bool) {
    isFocus = bool;
}

function keyEvent(id) {
    if (id == 'Enter') {
        if (isRowComplete()) {
            return verifyWord();
        } else {
            return alert(`Row ${currentRow} is not filled, try filling it.`);
        }
    } else if (id.includes('<i') || id == 'Backspace') {
        if (!isFocus) {
            let tiles = document.getElementsByClassName("tile");
            for (let i = tiles.length; i < 0; i--) {
                let currentTile = tiles.item(i);
                if (currentTile.value != "" && parseInt(currentTile.id) <= currentRow * 5) {
                    currentTile.value = ""
                    currentTile.innerHTML = ""
                    break
                }
            }
        }
    } else {
        if (id.length == 1 && isNaN(parseInt(id))) {
            id = id.toUpperCase();
            let tiles = document.getElementsByClassName("tile");
            for (let i = 0; i < tiles.length; i++) {
                let currentTile = tiles.item(i);
                if (currentTile.value == "" && parseInt(currentTile.id) <= currentRow * 5) {
                    currentTile.value = id
                    currentTile.innerHTML = id
                    currentTile.focus();
                    currentTile.select();
                    break
                }
            }
        }
    }
}

function changeInputToKeyClicked(key) {
    let tiles = document.getElementsByClassName("tile");
    for (let i = 0; i < tiles.length; i++) {
        let currentTile = tiles.item(i);
        if (currentTile.value == "" && parseInt(currentTile.id) <= currentRow * 5) {
            currentTile.value = key
            currentTile.innerHTML = key
            break
        }
    }
}

function buttonClicked(element) {
    let key = element.innerHTML
    changeInputToKeyClicked(key)
    keyEvent(element.innerHTML)
}

function clearTiles() {
    console.log("clear")
    currentRow = 1;
    let tiles = document.getElementsByClassName("tile");
    for (let i = 0; i < tiles.length; i++) {
        let element = tiles.item(i);
        element.value = "";
        console.log(parseInt(element.id), parseInt(element.id) > currentRow * 5)
        if (parseInt(element.id) > currentRow * 5) {
            element.disabled = "true"
        }
    }
}

function endGame(result) {
    document.getElementById('result').innerText = result;
}