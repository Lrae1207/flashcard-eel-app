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
        text = fileReader.result.slice(0,497) + "...";

        previewText.textContent = text;
    }
    fileReader.readAsText(this.files[0]);
}

function displayError(message) {
    errorText.innerText = "ERROR: " + message;
}

function loadSetPage() {

    sessionStorage.setItem('setName',setName);
    sessionStorage.setItem('setData',JSON.stringify(setData));
    document.URL ='set.html'
}