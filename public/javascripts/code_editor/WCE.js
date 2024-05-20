const languageDropdown = document.getElementById("language");

async function loadLanguages() {
    try {
        const response = await fetch("/api/loadLanguages");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching languages", error);
        return null;
    }
}
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    autoCloseBrackets: true,
    mode: "javascript",
    theme: "darcula"
});

editor.on("change", (cm, change) => {
    if (change.origin !== "setValue") {
        window.socket.emit("code", {input: cm.getValue()});
    }
});

window.socket.on("code", (data) => {
    const currentContent = editor.getValue();
    if (data.input !== currentContent) {
        editor.setValue(data.input);
    }
});

window.socket.on("language", (data) => {
    languageDropdown.value = data;
    editor.setOption("mode", data);
});

loadLanguages()
    .then(data => {
        data.languages.forEach(lang => {
            const option = document.createElement("option");
            option.value = lang.mode;
            option.textContent = lang.name;
            languageDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error loading languages:", error));

languageDropdown.addEventListener("change", function() {
    const mode = this.value; 
    editor.setOption("mode", mode);
    window.socket.emit("language", mode);
});

const themeDropdown = document.getElementById("theme");
themeDropdown.addEventListener("change", () =>{
    const value = themeDropdown.value;
    changeTheme(value);    
});

function changeTheme(value){
    const theme = value; 
    editor.setOption("theme", theme);
}
changeTheme("solarized");
changeTheme("darcula");

