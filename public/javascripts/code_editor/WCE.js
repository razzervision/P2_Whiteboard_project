// Function to load languages from JSON file
function loadLanguages() {
    return new Promise((resolve, reject) => {
        // Fetch the JSON file
        fetch("/javascripts/code_editor/languages.json")
            .then(response => response.json())
            .then(data => resolve(data.languages))
            .catch(error => reject(error));
    });
}

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: "javascript", // Default language
    theme: "darcula" // Default theme
});

// Populate language dropdown
loadLanguages()
    .then(languages => {
        const languageDropdown = document.getElementById("language");
        languages.forEach(lang => {
            const option = document.createElement("option");
            option.value = lang.mode;
            option.textContent = lang.name;
            languageDropdown.appendChild(option);

            const script = document.createElement("script");
            script.src = lang.script;
            document.head.appendChild(script);
        });
    })
    .catch(error => console.error("Error loading languages:", error));

// Event listener for language selection dropdown
document.getElementById("language").addEventListener("change", function() {
    const mode = this.value; // Get the selected mode
    editor.setOption("mode", mode);
});

// Event listener for theme selection dropdown
document.getElementById("theme").addEventListener("change", function() {
    const theme = this.value; // Get the selected theme
    editor.setOption("theme", theme);
});
