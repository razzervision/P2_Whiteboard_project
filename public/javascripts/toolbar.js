// const rezize = require('./paint.js');

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

codeProgramId.style.position = "flex";
codeProgramId.style.height = "100%";
codeProgramId.style.width = "100%";

class Program {
    constructor(value, isActive = false) {
        this.value = value;

        this.isActive = isActive;
    }
}

const paintProgram = new Program("paintProgram", true);
const codeProgram = new Program("codeProgram");
const quizProgram = new Program("quizProgram");
const calcProgram = new Program("calcProgram");
const timerProgram = new Program("timerProgram");

// An array to hold all program instances
const programs = [paintProgram, codeProgram, quizProgram, calcProgram, timerProgram];

let draggedElementX, draggedElementY = 0;

primaryDropzone.style.height = window.innerHeight + "px";
const primaryDropzoneHeight = window.innerHeight;
primaryDropzone.style.width = window.innerWidth + "px";
const primaryDropzoneWidth = window.innerWidth;
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
let runOrder;

let elementOrder = [];
elementOrder.push(paintProgramId);
function dragStart(e) {
    runOrder = false;

    draggedElement = this;
    // elementOrder.push(divConverter(draggedElement));
    offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
    offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
}

function drag(e) {
    let pos;
    if (draggedElement !== null) {
        draggedElement.style.position = "absolute";
        draggedElement.style.left = (e.clientX - offsetX) + "px";
        draggedElement.style.top = (e.clientY - offsetY) + "px";

        const elementToDisplay = divConverter(draggedElement);

        if (e.clientX < primaryDropzoneWidth / 4) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 1);
            pos = 1;
        } else if (e.clientX > (primaryDropzoneWidth / 4) * 3) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 2);
            pos = 2;
        } else if (e.clientX > primaryDropzoneWidth / 4 && e.clientX < (primaryDropzoneWidth / 4) * 3 && e.clientY > primaryDropzoneHeight / 2) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 3);
            pos = 3;
        } else if (e.clientX > primaryDropzoneWidth / 4 && e.clientX < (primaryDropzoneWidth / 4) * 3 && e.clientY < primaryDropzoneHeight / 2) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 4);
            pos = 4;
        }

        if (!runOrder) {
            switch (pos) {
                case 1:
                    elementOrder.unshift(elementToDisplay);
                    break; 
                case 2:
                    elementOrder.unshift(elementToDisplay);
                    break; 
                case 3:
                    elementOrder.push(elementToDisplay);
                    break;
                case 4:   
                    elementOrder.push(elementToDisplay);
                    break; 
            }
            runOrder = true;
        }

        draggedElementX = (e.clientX - offsetX) + "px";
        draggedElementY = (e.clientY - offsetY) + "px";
    }
}

function dragEnd() {
    const dataValue = draggedElement.getAttribute("data-value");
    const program = programs.find(program => program.value === dataValue);
    program.isActive = true;
    draggedElement.style.display = "none";
    draggedElement = null;
}

function splitScreen (units, percentL, percentMid, percentHalf) {
    // console.log(units, percentL, percentMid, percentHalf);
    let percentR = 100 - percentL - percentMid + "%";
    percentL += "%";
    percentMidBool = percentMid;
    percentMid += "%";
    totalStringRL = percentL + " " + percentR;
    totalStringHalf = 100 - percentHalf + "%";

    primaryDropzone.style.display = "grid";
    primaryDropzone.style.gridGap = "10px";

    if (units === 2) {
        if (percentHalf > 0) {
            primaryDropzone.style.gridTemplateRows = totalStringHalf;
        } else {
            primaryDropzone.style.gridTemplateColumns = totalStringRL;
        }
    } else if (units === 3) {
        if (percentMidBool > 0) {
            totalStringRL = percentL + " " + percentMid + " " + percentR;
            primaryDropzone.style.gridTemplateColumns = totalStringRL;
        } else {
            primaryDropzone.style.gridTemplateRows = totalStringHalf;
        }
    } 
}

// place = 1,2,3,4   1 left, 2 top-center, 3 right, 4 bottom-center
let run = false;
function sizeElement (element, activePrograms, activeProgramsList, place) {
    element.style.position = "flex";
    element.style.display = "block";
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

        if (place === 1) {
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
            splitScreen(2, 70, 0, 0);
        } else if (place === 3) {
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
            splitScreen(2, 30, 0, 0);
        } else if (place === 2) {
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
            splitScreen(2, 0, 0, 30);
        } else if (place === 4) {
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
            splitScreen(2, 0, 0, 70);
        }
    }

    if (activePrograms === 2) {
        primaryDropzone.innerHTML = "";
        if (place === 1) {
            splitScreen(3, 20, 50, 0);
            primaryDropzone.appendChild(element);
            elementOrder.forEach(element => {
                primaryDropzone.appendChild(element);
            });
            
        } else if (place === 3) {

        } else {

        }


        // splitScreen(3, 20, 0, 50);
        // element.style.gridColumnStart = "span 2";
        // primaryDropzone.appendChild(element);


        // primaryDropzone.appendChild();

        // if (leftORright === 1) {
        //     // primaryDropzone.style.gridTemplateColumns = "70% 30%";
        //     splitScreen(2, 70, 0);
        // } else {
        //     // primaryDropzone.style.gridTemplateColumns = "30% 70%";   
        //     splitScreen(2, 30, 0);

        // }

        // if (!run) {      
        //     secondRow.style.gridColumnStart = "span 2";

        //     secondRow.appendChild(element);
        //     primaryDropzone.appendChild(secondRow);
        //     run = true;
        // }
        // element.style.display = "block";

        // const newList = [];
        // activeProgramsList.forEach(elem => {
        //     const str = "#" + elem.value;
        //     const activeProgram = document.querySelector(str);
        //     newList.push(activeProgram);
        //     primaryDropzone.removeChild(activeProgram);
        // });

        // if (place === 1 || place === 2) {
        //     primaryDropzone.style.gridTemplateRows = "40%";

        //     primaryDropzone.appendChild(secondRow);
        //     primaryDropzone.appendChild(newList[1]);
        //     primaryDropzone.appendChild(newList[0]);
        // } else {
        //     primaryDropzone.style.gridTemplateRows = "60%";

        //     primaryDropzone.appendChild(newList[1]);
        //     primaryDropzone.appendChild(newList[0]);
        //     primaryDropzone.appendChild(secondRow);

        // }
    }
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