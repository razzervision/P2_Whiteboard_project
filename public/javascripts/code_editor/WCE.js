function loadLanguages() {
    return new Promise((resolve, reject) => {
        // Fetch the JSON file
        fetch("/javascripts/code_editor/languages.json")
            .then(response => response.json())
            .then(data => resolve(data.languages))
            .catch(error => reject(error));
    });
}

const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    autoCloseBrackets: true,
    mode: "javascript",
    theme: "darcula"
});

loadLanguages()
    .then(languages => {
        const languageDropdown = document.getElementById("language");
        languages.forEach(lang => {
            const option = document.createElement("option");
            option.value = lang.mode;
            option.textContent = lang.name;
            languageDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error loading languages:", error));

document.getElementById("language").addEventListener("change", function() {
    const mode = this.value; 
    editor.setOption("mode", mode);
});

document.getElementById("theme").addEventListener("change", function() {
    const theme = this.value; 
    editor.setOption("theme", theme);
});
