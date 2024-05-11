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

const elementOrder = [];
elementOrder.push(paintProgramId);
function dragStart(e) {
    runOrder = false;

    draggedElement = this;
    // elementOrder.push(divConverter(draggedElement));
    offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
    offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
}

let pos;
let elementToDisplay;
function drag(e) {

    if (draggedElement !== null) {
        draggedElement.style.position = "absolute";
        draggedElement.style.left = (e.clientX - offsetX) + "px";
        draggedElement.style.top = (e.clientY - offsetY) + "px";

        elementToDisplay = divConverter(draggedElement);

        if (e.clientX < primaryDropzoneWidth / 4) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 1);
            pos = 1;
        } else if (e.clientX > (primaryDropzoneWidth / 4) * 3) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 3);
            pos = 3;
        } else if (e.clientX > primaryDropzoneWidth / 4 && e.clientX < (primaryDropzoneWidth / 4) * 3 && e.clientY > primaryDropzoneHeight / 2) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 4);
            pos = 4;
        } else if (e.clientX > primaryDropzoneWidth / 4 && e.clientX < (primaryDropzoneWidth / 4) * 3 && e.clientY < primaryDropzoneHeight / 2) {
            sizeElement(elementToDisplay, checkActivePrograms(), checkActiveProgramsList(), 2);
            pos = 2;
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
}

let str2Columns = "";
let str2Rows = "";
function splitScreen (units, percentLeft, percentMiddle, percentVerticalHalf) {
    primaryDropzone.style.gridTemplateColumns = "";
    primaryDropzone.style.gridTemplateRows = "";
    // console.log(units, percentL, percentMid, percentHalf);
    const percentRight = 100 - percentLeft - percentMiddle;
    const percentTop = 100 - percentVerticalHalf;
    primaryDropzone.style.display = "grid";
    primaryDropzone.style.gridGap = "10px";

    if (units === 2) {
        // place left / right
        if (percentVerticalHalf === 0) {
            str2Columns = percentLeft + "% " + percentRight + "%";
            primaryDropzone.style.gridTemplateColumns = str2Columns;
        // place middle    
        } else if (percentVerticalHalf > 0) {
            str2Rows = percentVerticalHalf + "% " + percentTop + "%";
            primaryDropzone.style.gridTemplateRows = str2Rows;
        }

    } else if (units === 3) {
        // const newBox = document.createElement("div");
        // 3 besides eachother
        if (percentMiddle > 0) {
            const str = percentLeft + "% " + percentMiddle + "% " + percentRight + "%";
            primaryDropzone.style.gridTemplateColumns = str;
        } else if (percentLeft > 0) {   
            const str = percentLeft + "% " + percentRight + "%";
            primaryDropzone.style.gridTemplateColumns = str;
            primaryDropzone.style.gridTemplateRows = str2Rows;
        } else {
            const str = percentVerticalHalf + "% " + percentTop + "%";
            primaryDropzone.style.gridTemplateColumns = str2Columns;
            primaryDropzone.style.gridTemplateRows = str;
        }

    }
}

// place = 1,2,3,4   1 left, 2 top-center, 3 right, 4 bottom-center
const run = false;
let hasRun = false;

let ontop = false;
let place3;
function sizeElement (element, activePrograms, activeProgramsList, place) {
    element.style.position = "flex";
    element.style.display = "block";

    if (activePrograms === 1) {
        const str = "#" + activeProgramsList[0].value;
        const activeProgram = document.querySelector(str);

        primaryDropzone.style.display = "grid";
        primaryDropzone.style.gridGap = "10px";
        element.style.width = "100%";
        element.style.height = "100%";
        activeProgram.style.width = "100%";
        activeProgram.style.height = "100%";

        // LEFT
        if (place === 1) {
            ontop = false;
            splitScreen(2, 30, 0, 0);
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
        // RIGHT    
        } else if (place === 3) {
            ontop = false;
            splitScreen(2, 70, 0, 0);
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
        // TOP MID
        } else if (place === 2) {
            ontop = true;
            splitScreen(2, 0, 0, 30);
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
        // BOTTOM MID
        } else if (place === 4) {
            ontop = true;
            splitScreen(2, 0, 0, 70);
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
        }
    }


    if (activePrograms === 2) {
        if (!ontop) {
            element.style.gridRow = "";
            element.style.gridColumn = "";
            element.style.gridArea = "";
        }
        

        if (place === 1) {
            if (!ontop) {
                splitScreen(3, 20, 60, 0);
                primaryDropzone.appendChild(element);
                addElements();
                place3 = 1;
            } else {
                element.style.gridRow = "";
                element.style.gridColumn = "";
                element.style.gridArea = "";
                splitScreen(3, 30, 0, 0);
                primaryDropzone.appendChild(element);
                element.style.gridRow = "-1 / 1";
                addElements();
                place3 = 2;
            }

        } else if (place === 3) {
            if (!ontop) {
                splitScreen(3, 20, 60, 0);
                addElements();
                primaryDropzone.appendChild(element);
                place3 = 3;
            } else {
                splitScreen(3, 70, 0, 0);
                addElements();
                element.style.gridColumn = "-2 / 2";
                primaryDropzone.appendChild(element);
                console.log("not ot anymore");
                place3 = 4;
            }

        } else if (place === 2) {
            if (!ontop) {
                splitScreen(3, 0, 0, 30);
                element.style.gridColumn = "-1 / 1";
                place3 = 5;
            }
 
        } else if (place === 4) {
            if (!ontop) {
                splitScreen(3, 0, 0, 70);
                element.style.gridColumn = "-1 / 1";
                place3 = 6;
            }
        }
        console.log(place3);

    } else if (activePrograms === 3) {
        if (place3 === 1 || place3 === 3) {
            element.style.gridColumn = "1 / span 3"; 
            if (place === 2) {
                primaryDropzone.appendChild(element);
                addElements();
            } else if (place === 4) {
                primaryDropzone.appendChild(element);
            }
        } else if (place3 === 2) {
            console.log("left");
            elementOrder[0].style.gridArea = "2";
            primaryDropzone.appendChild(element);
            addElements();
        } else if (place3 === 4) {
            console.log("right");
            elementOrder[2].style.gridArea = "";
            if (!hasRun) {
                const lastElement = elementOrder.pop();
                const secondLastElement = elementOrder.pop();
                elementOrder.push(lastElement);
                elementOrder.push(secondLastElement);
                hasRun = true;
            }

            addElements();
            primaryDropzone.appendChild(element);
        }
    }
}

function addElements () {
    elementOrder.forEach(element => {
        primaryDropzone.appendChild(element);
    });
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

// function clearScreen (addedElement) {
//     primaryDropzone.removeChild(paintProgramId);
//     for (let i = 0; i < elementOrder.length; i++) {
//         if (!addedElement === elementOrder[i]) {
//             primaryDropzone.removeChild(elementOrder[i]);
//         }
//     }
//     console.log(elementOrder);
// }