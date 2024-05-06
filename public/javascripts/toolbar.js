const paintElement = document.querySelector("#paintElement");
const codeEditorElement = document.querySelector("#codeEditorElement");
const quizElement = document.querySelector("#quizElement");
const calculatorElement = document.querySelector("#calculatorElement");
const timerElement = document.querySelector("#timerElement");

const toolbar = document.getElementById("toolbar");

const primaryDropzone = document.querySelector("#primaryDropzone");
// const drawArea = document.querySelector("#drawArea");

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

codeProgramId.style.position = "absolute";

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

primaryDropzone.style.height = window.innerHeight + "px";
const primaryDropzoneHeight = window.innerHeight;
primaryDropzone.style.width = window.innerWidth + "px";
const primaryDropzoneWidth = window.innerWidth;
console.log(primaryDropzoneWidth);
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
}

function drag(e) {
    if (draggedElement !== null) {
        draggedElement.style.position = "absolute";
        draggedElement.style.left = (e.clientX - offsetX) + "px";
        draggedElement.style.top = (e.clientY - offsetY) + "px";

        const elementToDisplay = divConverter(draggedElement);
        if (e.clientX < (document.querySelector("#primaryDropzone").offsetWidth)/2 && e.clientY < (primaryDropzoneHeight/2)) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 1);
        } else if (e.clientX > (document.querySelector("#primaryDropzone").offsetWidth)/2 && e.clientY < (primaryDropzoneHeight/2)) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 2);
        } else if (e.clientX < (document.querySelector("#primaryDropzone").offsetWidth)/2 && e.clientY > (primaryDropzoneHeight/2)) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 3);
        } else if (e.clientX > (document.querySelector("#primaryDropzone").offsetWidth)/2 && e.clientY > (primaryDropzoneHeight/2)) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 4);
        }
        draggedElementX = (e.clientX - offsetX) + "px";
        draggedElementY = (e.clientY - offsetY) + "px";
    }
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
    let i = 0;
    programs.forEach(program => {
        if (program.isActive === true) {
            i++;
        }
    });
    return i;
}

function checkActiveProgramsList () {
    const i = [];
    programs.forEach(program => {
        if (program.isActive === true) {
            i.push(program);
        }
    });
    return i;
}

// place = 1,2,3,4   1 topleft, 2 topright, 3 bottomleft, 4 bottomright
let run = false;
const secondRow = document.createElement("div");
function sizeElement (element, activePrograms, activeProgramsList, place) {
    let leftORright;

    if (activePrograms === 1) {
        const str = "#" + activeProgramsList[0].value;
        const activeProgram = document.querySelector(str);

        primaryDropzone.removeChild(activeProgram);

        primaryDropzone.style.display = "grid";
        primaryDropzone.style.gridGap = "10px";
        element.style.width = "100%";
        element.style.height = "100%";
        activeProgram.style.width = "100%";
        activeProgram.style.height = "100%";
        element.style.display = "block";

        if (place === 2 || place === 4) {
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
            primaryDropzone.style.gridTemplateColumns = "70% 30%";
            leftORright = 1;
        } else {
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.style.gridTemplateColumns = "30% 70%";
            leftORright = 2;
        }
    }

    if (activePrograms === 2) {

        if (leftORright === 1) {
            primaryDropzone.style.gridTemplateColumns = "70% 30%";
        } else {
            primaryDropzone.style.gridTemplateColumns = "30% 70%";   
        }

        if (!run) {      
            secondRow.style.gridColumnStart = "span 2";

            secondRow.appendChild(element);
            primaryDropzone.appendChild(secondRow);
            run = true;
        }
        element.style.display = "block";

        const newList = [];
        activeProgramsList.forEach(elem => {
            const str = "#" + elem.value;
            const activeProgram = document.querySelector(str);
            newList.push(activeProgram);
            primaryDropzone.removeChild(activeProgram);
        });

        if (place === 1 || place === 2) {
            primaryDropzone.style.gridTemplateRows = "22%";

            primaryDropzone.appendChild(secondRow);
            primaryDropzone.appendChild(newList[1]);
            primaryDropzone.appendChild(newList[0]);
        } else {
            primaryDropzone.style.gridTemplateRows = "70%";

            primaryDropzone.appendChild(newList[1]);
            primaryDropzone.appendChild(newList[0]);
            primaryDropzone.appendChild(secondRow);

        }
    }
}