// Set data
var setName = null;
var setData = null;
var setSize = 0;
var validSet = false;

// study section data
var currentCardIndex = 0;
var isShuffled = false;
var isTermShownDefault = true;
var isTermShown = true;
var rightButtonActive = false;
var leftButtonActive = false;

// divs
const divSetSelection = document.getElementById("set-section");
const divSetPreview = document.getElementById("set-preview-section");

const divStudyFlashcard = document.getElementById("study-flashcard-viewport");
const divStudyCardDisplay = document.getElementById("study-flashcard");
const divStudyButtons = document.getElementById("study-flashcard-buttons");

const divAbout = document.getElementById('about-section');

const divError = document.getElementById('error-section');

// Misc. elements
const title = document.getElementById("page-title");
const navbar = document.getElementById("page-navbar-top");
const header = document.getElementById("page-header");

const fileInput = document.getElementById("set-select");
const setNameDisplay = document.getElementById("set-name-display");
const setEditButton = document.getElementById("set-edit");
const previewText = document.getElementById("set-preview-text");

const studyFlashcardCounter = document.getElementById("study-flashcard-counter");
const studyIndexDisplay = document.getElementById("study-index-display");
const studyFlashcard = document.getElementById("study-flashcard-display");
const studyTermDisplay = document.getElementById("study-term-display");
const studyButtonLeft = document.getElementById("study-button-left");
const studyButtonRight = document.getElementById("study-button-right");
const studyButtonShuffle = document.getElementById("study-button-shuffle");
const studyButtonFlip = document.getElementById("study-button-flip");

const errorText = document.getElementById("error-text");

fileInput.addEventListener("change", onFileChange, false);
function onFileChange() {
    fileList = this.files;
    if (fileList.length < 1) {
        displayError("file selection failed");
        validSet = false;
        return;
    }
    setName = fileList[0].name;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        try {
            setData = JSON.parse(fileReader.result);
            setSize = setData.length;
            validSet = true;
            setNameDisplay.innerText = setName;
            setEditButton.hidden = false;
            displayPreview();
            clearError();
            showFlashcard();
        } catch {
            clearPreview();
            displayError("file was improperly formatted/wasn't json file");
            validSet = false;
            setSize = 0;
        }
    }
    fileReader.readAsText(this.files[0]);
}

previewText.setAttribute('style', 'white-space: pre;');
const previewCharLimit = 500;
function displayPreview() {
    var previewStr = "";
    var index = 0;
    while (previewStr.length < previewCharLimit && index < setData.length) {
        var term = setData[index]['term'];
        var desc = setData[index]['description'];
        previewStr += term + ": " + desc + "\n"; 
        index++;
    }

    if (previewStr.length > previewCharLimit) {
        previewStr = previewStr.slice(0,previewCharLimit - 3) + "..."; // truncate
    }

    previewText.textContent = previewStr;
}

function clearPreview() {
    previewText.textContent = "";
}

function updateButtons () {
    if (currentCardIndex == 0) {
        leftButtonActive = false;
        rightButtonActive = true;
    } else if (currentCardIndex == setSize - 1) {
        leftButtonActive = true;
        rightButtonActive = false;
    } else {
        leftButtonActive = true;
        rightButtonActive = true;
    }

    studyButtonLeft.classList.remove("inactive-button");
    if (!leftButtonActive) {
        studyButtonLeft.classList.add("inactive-button");
    }

    studyButtonRight.classList.remove("inactive-button");
    if (!rightButtonActive) {
        studyButtonRight.classList.add("inactive-button");
    }

    studyButtonShuffle.classList.remove("inactive-button");
    if (!validSet) {
        studyButtonShuffle.classList.add("inactive-button");
    }

    studyButtonFlip.classList.remove("inactive-button");
    if (!validSet) {
        studyButtonFlip.classList.add("inactive-button");
    }
}

function showFlashcard() {
    studyFlashcardCounter.innerText = "Flashcard #: " + setSize;
    studyIndexDisplay.innerText = (currentCardIndex + 1) + "/" + setSize;

    updateButtons();

    if (isTermShown) {
        studyFlashcard.innerText = setData[currentCardIndex]['term'];
        studyTermDisplay.innerText = "Term:";
        return;
    }
    studyFlashcard.innerText = setData[currentCardIndex]['description'];
    studyTermDisplay.innerText = "Description:";
}

function switchFlashcardLeft() {
    if  (!validSet || !leftButtonActive) {
        return;
    }
    if (currentCardIndex <= 0) {
        currentCardIndex = 0;
        return;
    }
    currentCardIndex--;
    isTermShown = isTermShownDefault;
    showFlashcard();
}

function switchFlashcardRight() {
    if  (!validSet || !rightButtonActive) {
        return;
    }
    if (currentCardIndex >= setSize - 1) {
        currentCardIndex = setSize - 1;
        return;
    }
    currentCardIndex++;
    isTermShown = isTermShownDefault;
    showFlashcard();
}

function shuffleCards() {

}

function flipCard() {
    if  (!validSet) {
        return;
    }
    isTermShown = !isTermShown;
    showFlashcard();
}

function clearError() {
    divError.hidden = true;
    errorText.innerText = "";
}

function displayError(message) {
    divError.hidden = false;
    errorText.innerText = "ERROR: " + message;
}

document.onload = function() {
    
};