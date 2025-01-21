
let filenames = null;
let setSection = document.getElementById('set-section');

// wrapper
async function getFileNames() {
    return await eel.get_file_names()();
}

// load all of the files json in sets directory
window.addEventListener('load', async function() {
    filenames = await getFileNames();
    filenames.forEach(name => {
        let childNode = this.document.createElement("p");
        childNode.innerText = name;
        let childButton = this.document.createElement("button");
        childButton.innerText = "Select" + name;
        childButton.onclick = "loadSetPage(" + name + ");";
        setSection.appendChild(childNode);
        setSection.appendChild(childButton);
    });
    console.log(filenames);
});

async function loadSetPage(setName) {
    sessionStorage.setItem('setName',setName);
    document.URL ='set.html'
}

async function getJSONFromPython(fileName) {
    let json = await eel.read_file()();
    console.log(json);
    return json;
}