setName = null;
setData = null;

const fileInput = document.getElementById("set-select");
const errorText = document.getElementById("error-text");
const previewText = document.getElementById("preview-text");


fileInput.addEventListener("change", onFileChange, false);
function onFileChange() {
    fileList = this.files;
    if (fileList.length < 1) {
        displayError("file selection failed");
        return;
    }
    var setName = fileList.name;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        try {
            setData = JSON.parse(fileReader.result);
            
            displayPreview();
        } catch {
            displayError("file was improperly formatted/wasn't json file");
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

function displayError(message) {
    errorText.hidden = false;
    errorText.innerText = "ERROR: " + message;
}

function loadSetPage() {

    sessionStorage.setItem('setName',setName);
    sessionStorage.setItem('setData',JSON.stringify(setData));
    document.URL ='set.html'
}