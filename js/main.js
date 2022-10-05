let currentRow = 1;

function tapKeyAnimation(key) {
    document.querySelectorAll("keyboard-button").forEach(function(element) {
        if (element.innerHTML == key) {
            element.style.opacity = 0.5;
        }
    });
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
    document.querySelectorAll("tile").forEach(function(element) {
        inputsFilled += element.value != "" && 1 || 0;
    });
    return inputsFilled >= 5;
}

function retrieveWord() {
    let word = "";
    document.querySelectorAll("tile").forEach(function(element) {
        if (parseInt(element.id) >= currentRow * 5) {
            word += element.innerHTML;
        }
    });
    return word;
}

function verifyWord() {
    let countId = 0;
    document.querySelectorAll("tile").forEach(function(element) {
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

function keyEvent(id) {
    console.log(id);
    if (id == 'Enter') {
        if (isRowComplete()) {
            verifyWord();
        } else {
            return alert(`Row ${currentRow} is not filled, try filling it.`);
        }
    } else if (id.includes('<i>') || id == 'Backspace') {

    } else {

    }
}

function buttonClicked(element) {
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

document.addEventListener('keydown', (event) => {
    keyEvent(event.key)
});