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


document.querySelectorAll(".minimizeButton").forEach(button => {
    button.addEventListener("click", function(e2) {
        minimizeProgram(e2.target);
    });
});

let draggedElement = null;

let offsetX = 0;
let offsetY = 0;
let runOrder;

let elementOrder = [];
elementOrder.push(paintProgramId);

primaryDropzone.style.gridTemplateColumns = "100%";

const elemStyleColumn = "";
const elemStyleRow = "";
const elemStyleArea = "";
let primaryStyleColumn = "100%";
let primaryStyleRow = "";

let lastElementDragged;

function dragStart(e) {
    draggedElement = this;

    primaryStyleColumn = primaryDropzone.style.gridTemplateColumns;
    primaryStyleRow = primaryDropzone.style.gridTemplateRows;
    
    // elemStyleColumn = divConverter(draggedElement).style.gridColumn;
    // elemStyleRow = divConverter(draggedElement).style.gridRow;
    // elemStyleArea = divConverter(draggedElement).style.gridArea;
    // primaryStyleColumn = primaryDropzone.style.gridTemplateColumns;
    // primaryStyleRow = primaryDropzone.style.gridTemplateRows;

    runOrder = false;

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

function dragEnd(e) {
    if (e.target.classList.contains("minimizeButton")) {return;}
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
    saveDataSocket();
}


let str2Columns = "";
let str2Rows = "";
function splitScreen (units, percentLeft, percentMiddle, percentVerticalHalf) {
    primaryDropzone.style.gridTemplateColumns = "";
    primaryDropzone.style.gridTemplateRows = "";
    const percentRight = 100 - percentLeft - percentMiddle;
    const percentTop = 100 - percentVerticalHalf;
    primaryDropzone.style.display = "grid";
    primaryDropzone.style.gridGap = "10px";

    if (units === 2) {
        if (percentVerticalHalf === 0) {
            str2Columns = percentLeft + "% " + percentRight + "%";
            primaryDropzone.style.gridTemplateColumns = str2Columns;
        } else if (percentVerticalHalf > 0) {
            str2Rows = percentVerticalHalf + "% " + percentTop + "%";
            primaryDropzone.style.gridTemplateRows = str2Rows;
        }

    } else if (units === 3) {
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

        if (place === 1) {
            ontop = false;
            splitScreen(2, 30, 0, 0);
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
        } else if (place === 3) {
            ontop = false;
            splitScreen(2, 70, 0, 0);
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
        } else if (place === 2) {
            ontop = true;
            splitScreen(2, 0, 0, 30);
            primaryDropzone.appendChild(element);
            primaryDropzone.appendChild(activeProgram);
        } else if (place === 4) {
            ontop = true;
            splitScreen(2, 0, 0, 70);
            primaryDropzone.appendChild(activeProgram);
            primaryDropzone.appendChild(element);
        }
    }

    if (activePrograms === 2) {
        if (!ontop) {
            element.style.gridArea = "";
        }

        if (place === 1) {
            if (!ontop) {
                splitScreen(3, 20, 60, 0);
                primaryDropzone.appendChild(element);
                addElements();
                place3 = 1;
            } else {
                splitScreen(3, 30, 0, 0);
                primaryDropzone.appendChild(element);
                element.style.gridArea = "";
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
                element.style.gridArea = "";
                element.style.gridColumn = "2 / 3";
                element.style.gridRow = "1 / 3";
                primaryDropzone.appendChild(element);
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

        } else if (place === 5) {
            if (!ontop) {
                splitScreen(3, 0, 0, 30);
                element.style.gridColumn = "-1 / 1";
                primaryDropzone.appendChild(element);
            }
        } else if (place === 6) {
            splitScreen(3, 0, 0, 70);
            element.style.gridColumn = "-1 / 1";
            addElements();
            primaryDropzone.appendChild(element);
        }

    } else if (activePrograms === 3) {
        if (place3 === 1 || place3 === 3) {
            element.style.gridColumn = "1 / span 3"; 
            if (place === 2) {
                primaryDropzone.appendChild(element);
                addElements();
            } else if (place === 4) {
                primaryDropzone.appendChild(element);
            } else {
                primaryDropzone.appendChild(element);
            }
        } else if (place3 === 2) {
            elementOrder[0].style.gridArea = "2";
            primaryDropzone.appendChild(element);
            addElements();
        } else if (place3 === 4) {
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
        } else if (place3 === 5) {
            elementOrder[0].style.gridColumn = "";
            primaryDropzone.appendChild(element);
            addElements();
        } else if (place3 === 6) {
            elementOrder[2].style.gridArea = "";
            primaryDropzone.appendChild(element);
        }
        console.log(place3);
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


const webPage = document.querySelector("#webPage");
const toolbar = document.querySelector("#toolbarMenu");
const socketDiv = document.querySelector("#socketDiv");
let removing;

function minimizeProgram (target) {
    console.log(place3);
    const targetDValue = target.getAttribute("data-value");
    removing = targetDValue;
    let str = "#" + targetDValue;
    const programToRemove = document.querySelector(str);
    str = ".toolbarElement[data-value='" + targetDValue + "']";
    const targetToolbarElement = document.querySelector(str);
    programToRemove.style.display = "none";

    elementOrder = elementOrder.filter(element => element.getAttribute("id") !== targetDValue);
    const program = programs.find(program => program.value === targetDValue);
    if (program) {
        program.isActive = false;
    }

    webPage.appendChild(programToRemove);
    targetToolbarElement.style.position = "";
    targetToolbarElement.style.left = "";
    targetToolbarElement.style.top = "";
    targetToolbarElement.style.display = "";

    primaryDropzone.style.gridTemplateColumns = primaryStyleColumn;
    primaryDropzone.style.gridTemplateRows = primaryStyleRow;

    if (checkActivePrograms() === 1) {
        primaryDropzone.style.gridTemplateColumns = "100%";
    }

    if (checkActivePrograms() > 2) {
        if (place3 === 1 || place3 === 3) {
            primaryDropzone.style.gridTemplateColumns = "70% 30%";
        } else if (place3 === 2 || place3 === 4) {
            elementOrder[1].style.gridArea = "span 2";
        } else if (place3 === 5) {
            elementOrder[0].style.gridColumn = "span 2";
        } else if (place3 === 6) {
            elementOrder[0].style.gridColumn = "span 2";
        }
    }

    toolbar.appendChild(targetToolbarElement);
    toolbar.appendChild(socketDiv);

    saveDataSocket();
    removing = null;
}


let primaryDropzoneValues;
let elementsArray;
let elementsValues;
function saveDataSocket () {
    primaryDropzoneValues = [];
    elementsArray = [];
    elementsValues = [];

    primaryDropzoneValues.push(primaryDropzone.style.gridTemplateColumns, primaryDropzone.style.gridTemplateRows);

    elementOrder.forEach((element, i) => {
        elementsValues.push([]);
        elementsArray.push(element.getAttribute("id"));
        elementsValues[i].push(element.style.gridArea, element.style.gridColumn, element.style.gridRow);
        i++;
    });

    window.socket.emit("saveDataSocket", {
        primaryDropzoneValues: primaryDropzoneValues, 
        elementsArray: elementsArray, 
        elementsValues : elementsValues,
        removing : removing
    });
}


window.socket.on("saveDataSocket", function(data) {
    console.log(data.primaryDropzoneValues, data.elementsArray, data.elementsValues);

    primaryDropzone.style.display = "grid";
    primaryDropzone.style.gap = "10px";

    primaryDropzone.style.gridTemplateColumns = data.primaryDropzoneValues[0];
    primaryDropzone.style.gridTemplateRows = data.primaryDropzoneValues[1];

    if (data.removing == null) {
        data.elementsArray.forEach((element, i) => {
            let str = "#" + element;
            const elementToChange = document.querySelector(str);
            let newArr = data.elementsValues[i];
            console.log(elementToChange);

            elementToChange.style.gridArea = newArr[0];
            elementToChange.style.gridColumn = newArr[1];
            elementToChange.style.gridRow = newArr[2];

            primaryDropzone.appendChild(elementToChange);
            elementToChange.style.display = "block";

        });

    } else {
        let str = "#" + data.removing;
        const elementToDelete = document.querySelector(str);
        webPage.appendChild(elementToDelete);
        elementToDelete.style.display = "none";

        // for (let i = 0; i < elementOrder.length; i++) {
        //     if (elementOrder[i] === elementToDelete) {
        //         elementOrder.splice(i);
        //     }
            
        // }
    }
});