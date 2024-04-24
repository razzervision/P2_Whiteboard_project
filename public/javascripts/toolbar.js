const paintElement = document.querySelector("#paintElement");
const codeEditorElement = document.querySelector("#codeEditorElement");
const quizElement = document.querySelector("#quizElement");
const calculatorElement = document.querySelector("#calculatorElement");
const timerElement = document.querySelector("#timerElement");

const toolbar = document.getElementById("toolbar");

const primaryDropzone = document.querySelector("#primaryDropzone");

const paintProgramId = document.querySelector("#paintProgram");
const codeProgramId = document.querySelector("#codeProgram");
const quizProgramId = document.querySelector("#quizProgram");
const calcProgramId = document.querySelector("#calcProgram");
const timerProgramId = document.querySelector("#timerProgram");

paintProgramId.style.display = "none";
codeProgramId.style.display = "none";
quizProgramId.style.display = "none";
calcProgramId.style.display = "none";
timerProgramId.style.display = "block";

class Program {
    constructor(name, value, width, height, top, left, isActive = false) {
        this.name = name;
        this.value = value;
        this.width = width;
        this.height = height;
        this.top = top;
        this.left = left;
        this.isActive = isActive;
    }
}

const paintProgram = new Program("Paint Program", "paintProgram", 0, 0, 0, 0, true);
const codeProgram = new Program("Code Program", "codeProgram", 0, 0, 0, 0);
const quizProgram = new Program("Quiz Program", "quizProgram", 0, 0, 0, 0);
const calcProgram = new Program("Calculator Program", "calcProgram", 0, 0, 0, 0);
const timerProgram = new Program("Timer Program", "timerProgram", 0, 0, 0, 0);

// An array to hold all program instances
const programs = [paintProgram, codeProgram, quizProgram, calcProgram, timerProgram];

let draggedElementX, draggedElementY = 0;

primaryDropzone.appendChild(document.querySelector("#paintProgram"));
paintProgramId.style.display = "block";


document.querySelectorAll(".toolbarElement").forEach(item => {
    item.addEventListener("mousedown", dragStart);
    item.addEventListener("dragstart", function(e) { e.preventDefault(); });
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
});


let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
    draggedElement = this;

    offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
    offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
    console.log(checkActivePrograms());
}

function drag(e) {
    if (draggedElement !== null) {
        draggedElement.style.position = "absolute";
        draggedElement.style.left = (e.clientX - offsetX) + "px";
        draggedElement.style.top = (e.clientY - offsetY) + "px";

        const elementToDisplay = divConverter(draggedElement);
        if (e.clientX < (document.querySelector("#drawArea").offsetWidth)/2) {

            splitScreen(checkActivePrograms(), true, elementToDisplay);
        } else {
            splitScreen(checkActivePrograms(), false, elementToDisplay);
        }
    }
    
    draggedElementX = (e.clientX - offsetX) + "px";
    draggedElementY = (e.clientY - offsetY) + "px";
}

function dragEnd() {
    const dataValue = draggedElement.getAttribute("data-value");
    const program = programs.find(program => program.value === dataValue);
    program.isActive = true;
    draggedElement = null;
}

function divConverter (draggedElement) {
    if (draggedElement !== null) {
        const str = "#" + draggedElement.dataset.value;
        const elem = document.querySelector(str);
        return elem;
    }   
}

function checkActivePrograms () {
    const i = [];
    programs.forEach(program => {
        if (program.isActive === true) {
            i.push(program);
        }
    });
    return i;
}

function splitScreen (activePrograms, leftOrRight, elementToDisplay) {
    // let new_divider = document.createElement("div");
    // document.querySelector("#draw_area").appendChild(new_divider);
    
    if (activePrograms.length === 1) {

        const programId = activePrograms[0].value;
        const programChange = document.querySelector("#" + programId);
        programChange.style.width = "70%";
        if (!leftOrRight) {
            programChange.style.left = "0%";
            sizeElement(elementToDisplay, "30%", "100%", "70%", "0%");
        } else {
            programChange.style.left = "30%";
            sizeElement(elementToDisplay, "30%", "100%", "0%", "0%");
        }
    }
}

function sizeElement (element, width, height, left, top) {
    primaryDropzone.appendChild(element);

    element.style.display = "block";
    element.style.width = width;
    element.style.height = height;
    element.style.left = left;
    element.style.top = top;
}