const paintButton = document.getElementById("paint_button");
const quizButton = document.getElementById("quiz_button");
const calcButton = document.getElementById("calc_button");
const codeButton = document.getElementById("code_button");
const timerButton = document.getElementById("timer_button");

const paintProgram = document.getElementById("paintProgram");
const codeProgram = document.getElementById("codeProgram");
const quizProgram = document.getElementById("quizProgram");
const calcProgram = document.getElementById("calcProgram");
const timerProgram = document.getElementById("timerProgram");


paintButton.addEventListener("click", function() {
    if (paintProgram.style.display === "none") {
        paintProgram.style.display = "block";
    } else {
        paintProgram.style.display = "none";
    }
});

codeButton.addEventListener("click", function() {
    if (codeProgram.style.display === "none") {
        codeProgram.style.display = "block";
    } else {
        codeProgram.style.display = "none";
    }
});

quizButton.addEventListener("click", function() {
    if (quizProgram.style.display === "none") {
        quizProgram.style.display = "block";
    } else {
        quizProgram.style.display = "none";
    }
});

calcButton.addEventListener("click", function() {
    if (calcProgram.style.display === "none") {
        calcProgram.style.display = "block";
    } else {
        calcProgram.style.display = "none";
    }
});

timerButton.addEventListener("click", function() {
    if (timerProgram.style.display === "none") {
        timerProgram.style.display = "block";
    } else {
        timerProgram.style.display = "none";
    }
});

// Function to make an element draggable only when cursor is near the edges
function makeDraggableNearEdge(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    // Function to handle mouse down event for dragging
    function dragMouseDown(e) {
        if (!isNearEdge(e, element)) {return;}
        e = e || window.event;
        e.preventDefault();
        // Get the initial mouse cursor position
        pos3 = e.clientX;
        pos4 = e.clientY;
        isDragging = true;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    // Function to handle element drag
    function elementDrag(e) {
        if (!isDragging) {return;}
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    // Function to handle mouse up event for dragging
    function closeDragElement() {
        // Stop dragging when mouse button is released
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // Add event listener for mouse down event to start dragging
    element.onmousedown = dragMouseDown;
}

// Function to check if cursor is near the edges of an element
function isNearEdge(e, element) {
    const edgeDistance = 20; // Adjust this value as needed
    const rect = element.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    return (
        x <= rect.left + edgeDistance ||
        x >= rect.right - edgeDistance ||
        y <= rect.top + edgeDistance ||
        y >= rect.bottom - edgeDistance
    );
}

// Make the draggable element
makeDraggableNearEdge(paintProgram);
makeDraggableNearEdge(codeProgram);
makeDraggableNearEdge(timerProgram);
makeDraggableNearEdge(quizProgram);
makeDraggableNearEdge(calcProgram);

