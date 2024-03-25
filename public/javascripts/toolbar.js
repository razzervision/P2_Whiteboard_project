const toolbarItems = document.querySelectorAll(".toolbar li");

toolbarItems.forEach(item => {
    item.addEventListener("click", () => {
        const clickedItemId = item.id;
        switch (clickedItemId) {
        case "paint_button":
            console.log("Paint button clicked");
        
            break;
        case "code_button":
            console.log("Code-editor button clicked");
            
            break;
        case "quiz_button":
            console.log("Quiz button clicked");
            
            break;
        case "calc_button":
            console.log("Calculator button clicked");
            
            break;
        default:
            
            break;
        }
    });
});