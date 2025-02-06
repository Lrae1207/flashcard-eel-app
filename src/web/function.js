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
    var setName = fileList.name;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        try {
            setData = JSON.parse(fileReader.result);
            setSize = setData.length;
            validSet = true;
            displayPreview();
            clearError();
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

// 0 = Sets
// 1 = Study
// 2 = About
function switchSection(pageIndex) {
    errorText.hidden = true;
    errorText.innerText = "";
    for (var i = 0; i < navbar.children.length; ++i) {
        var child = navbar.children[i];
        if (i == pageIndex) {
            child.classList.add("active");
            continue;
        }
        child.classList.remove("active");
    }
    loadPage(pageIndex);
}

function loadPage(pageIndex) {
    if (pageIndex == 0) {
        divSetPreview.hidden = false;
        divSetSelection.hidden = false;
        divStudyFlashcard.hidden = true;
        divAbout.hidden = true;
        header.innerText = "Sets";
        title.innerText = "Flashcards - Browsing Sets";
    }
    if (pageIndex == 1) {
        divSetPreview.hidden = true;
        divSetSelection.hidden = true;
        divStudyFlashcard.hidden = false;
        divAbout.hidden = true;
        title.innerText = "Flashcards - Studying " + (setName != null) ? setName : "a set";
        loadSetPage(validSet);
    }
    if (pageIndex == 2) {
        divSetPreview.hidden = true;
        divSetSelection.hidden = true;
        divStudyFlashcard.hidden = true;
        divAbout.hidden = false;
        header.innerText = "About";
        title.innerText = "Flashcards - About ";
    }
}

function loadSetPage(setIsValid) {
    if (!setIsValid) {
        header.innerText = "Please select a valid set";
        return;
    }

    showFlashcard();
}

function showFlashcard() {
    studyFlashcardCounter.innerText = "Flashcard #: " + setSize;
    studyIndexDisplay.innerText = (currentCardIndex + 1) + "/" + setSize;

    if (currentCardIndex == 0) {
        studyButtonLeft.hidden = true;
        studyButtonRight.hidden = false;
    } else if (currentCardIndex == setSize - 1) {
        studyButtonLeft.hidden = false;
        studyButtonRight.hidden = true;
    } else {
        studyButtonLeft.hidden = false;
        studyButtonRight.hidden = false;
    }

    if (isTermShown) {
        studyFlashcard.innerText = setData[currentCardIndex]['term'];
        studyTermDisplay.innerText = "Term:";
        return;
    }
    studyFlashcard.innerText = setData[currentCardIndex]['description'];
    studyTermDisplay.innerText = "Description:";
}

function switchFlashcardLeft() {
    if (currentCardIndex <= 0) {
        currentCardIndex = 0;
        return;
    }
    currentCardIndex--;
    isTermShown = isTermShownDefault;
    showFlashcard();
}

function switchFlashcardRight() {
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