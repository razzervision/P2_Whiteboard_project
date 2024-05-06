async function loadLanguages() {
    try {
        const response = await fetch("/api/loadLanguages");
        // if (!response.ok) {
        //     throw new Error(HTTP error! status: ${response.status});
        // }
        const data = await response.json();
        // Use the data to display your quiz
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null; // Return null or handle the error as needed
    }
}
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    autoCloseBrackets: true,
    mode: "javascript",
    theme: "darcula"
});

loadLanguages()
    .then(data => {
        const languageDropdown = document.getElementById("language");
        data.languages.forEach(lang => {
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
