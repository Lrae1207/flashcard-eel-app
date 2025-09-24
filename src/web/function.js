// Set data
var setName = null;
var setData = null;
var setSize = 0;
var validSet = false;
// each card should have term, memscore and description fields
var cardList = [];

// study section data
var currentCardIndex = 0;
var isShuffled = false;
var isTermShownDefault = true;
var isTermShown = true;
var rightButtonActive = false;
var leftButtonActive = false;

// divs
const divSetSelection = document.getElementById("set-section");
const divEditSection = document.getElementById("edit-section");
const divSetPreview = document.getElementById("set-preview-section");
const divEditPairs = document.getElementById("edit-pairs");
const divEditAdd = document.getElementById("edit-add");

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
const setSaveAsNewButton = document.getElementById("set-save-new");
const saveSet = document.getElementById("set-save");
const setDownloadButton = document.getElementById("set-edit");
const editNameInput = document.getElementById("edit-name");
const editCloseButton = document.getElementById("edit-close");
const editAddButton = document.getElementById("edit-add-button");
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
            parseSetData(setData);
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

function parseSetData(data) {
    cardList = [];
    for (var i = 0; i < data.length; ++i) {
        var card = {term:data[i]['term'],description:data[i]['description'],memLevel:data[i]['memLevel']};
        cardList.push(card);
    }
}

var pair = 0;
function openEditSet() {
    pair = 0;
    setEditButton.hidden = true;
    divEditSection.hidden = false;
    divEditPairs.replaceChildren();
    for (var i = 0; i < setSize; ++i) {
        var pairContainer = document.createElement("div");
        pairContainer.id = "pair" + i;

        editNameInput.value = setName;
        
        var term = document.createElement("input");
        term.id = "term" + pair;
        term.type = "text";
        term.value = cardList[i].term;
        term.classList.add("edit-pair-input");

        var desc = document.createElement("input");
        desc.id = "desc" + pair;
        desc.type = "text";
        desc.value = cardList[i].description;
        desc.classList.add("edit-pair-input");

        var deleteButton = document.createElement("button");
        deleteButton.innerText = "X";
        deleteButton.setAttribute("onclick", "javascript: deletePair(" + pair + ");");

        pairContainer.appendChild(term);
        pairContainer.appendChild(desc);
        pairContainer.appendChild(deleteButton);

        divEditPairs.appendChild(pairContainer);
        pair++;
    }
}

function addPair() {
    var pairContainer = document.createElement("div");
    pairContainer.id = "pair" + pair;
        
    var term = document("input");
    term.id = "term" + pair;
    term.type = "text";
    term.value = "term";

    var desc = document.createElement("input");
    desc.id = "desc" + pair;
    desc.type = "text";
    desc.value = "description";

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.setAttribute("onclick", "javascript: deletePair(" + pair + ");");

    pairContainer.appendChild(term);
    pairContainer.appendChild(desc);
    pairContainer.appendChild(deleteButton);

    divEditPairs.appendChild(pairContainer);
    pair++;
}

function deletePair(pairIndex) {
    console.log("pair" + pairIndex);
    document.getElementById("pair" + pairIndex).remove();
}

function restoreEditSet() {
    if (confirm("Restore un-edited set(delete all progress)?")) {
        openEditSet();
    }
}

function saveNewSet() {
    if (confirm("Save current set as a new set?")) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cardList));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", setName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}

function saveAndWriteSet() {

}

function closeEditSet() {
    if (confirm("Save all current changes to current set?")) {
        var oldSet = cardList;
        cardList = [];

        for (var i = 0; i < divEditPairs.children.length; ++i) { // todo: preserve memScore of unedited pairs
            var pairDiv = divEditPairs.children[i];
            var index = pairDiv.id.slice(-1); // last letter of div id
            var term = document.getElementById('term' + index).value;
            var desc = document.getElementById('desc' + index).value;
            var newCard = {term:term,description:desc,memLevel:0};
            cardList.push(newCard);
        }

        setSize = cardList.length;
        setName = editNameInput.value;
        displayPreview();
        clearError();
        showFlashcard();
        setEditButton.hidden = false;
        divEditSection.hidden = true;
    }
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
        studyFlashcard.innerText = cardList[currentCardIndex].term;
        studyTermDisplay.innerText = "Term:";
        return;
    }
    studyFlashcard.innerText = cardList[currentCardIndex].description;
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
    remainingCards = cardList;
    cardList = [];
    while (remainingCards.length > 0) {
        var index = Math.floor(Math.random() * remainingCards.length);
        var card = remainingCards[index];
        cardList.push({description : card.description, term : card.term, memLeve : card.memLevel});
        remainingCards.splice(index,1);
    }
    showFlashcard();
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