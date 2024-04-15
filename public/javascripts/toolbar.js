const paint_element = document.querySelector("#paint_element");
const code_editor_element = document.querySelector("#code_editor_element");
const quiz_element = document.querySelector("#quiz_element");
const calculator_element = document.querySelector("#calculator_element");
const timer_element = document.querySelector("#timer_element");

const toolbar = document.getElementById("toolbar");

const primary_dropzone = document.querySelector("#primary_dropzone");

const paintProgram = document.querySelector("#paintProgram");

paintProgram.style.display = "none";
codeProgram.style.display = "none";
quizProgram.style.display = "none";
calcProgram.style.display = "none";
timerProgram.style.display = "block";

// let paint_program_active = true;
// let code_program_active = false;
// let quiz_program_active = false;
// let calc_program_active = false;
// let timer_program_active = false;

const programs_active = [true, false, false, false, false];

class programs {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
  
    // Method to update the value
    updateValue(newValue) {
        this.value = newValue;
    }
  
    // Method to get the value
    getValue() {
        return this.value;
    }
}


const programs_active_class = [
    new programs("paint_program_active", true),
    new programs("code_program_active", false),
    new programs("quiz_program_active", false),
    new programs("calc_program_active", false),
    new programs("timer_program_active", false)
];


// let paint_program_active = new programs("paint_program_active", true);
// let code_program_active = new programs("code_program_active", false);
// let quiz_program_active = new programs("quiz_program_active", false);
// let calc_program_active = new programs("calc_program_active", false);
// let timer_program_active = new programs("timer_program_active", false);


let dragged_element_x, dragged_element_y = 0;

primary_dropzone.appendChild(document.querySelector("#paintProgram"));
paintProgram.style.display = "block";


document.querySelectorAll(".toolbar_element").forEach(item => {
    item.addEventListener("mousedown", dragStart);
    item.addEventListener("dragstart", function(e) { e.preventDefault(); });
});

document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

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
    }
    dragged_element_x = (e.clientX - offsetX) + "px";
    dragged_element_y = (e.clientY - offsetY) + "px";
}

function dragEnd() {
    div_converter(draggedElement);
    draggedElement = null;
    split_screen();
}

function div_converter (draggedElement) {
    if (draggedElement != null) {
        const str = "#" + draggedElement.dataset.value;
        const elem = document.querySelector(str);
        elem.style.display = "block";
    }   
}

function check_active_programs () {
    let i = 0;
    let j = 0;
    programs_active.forEach(e => {
        if (programs_active[i] == true) {
            j++;
        }
        i++;
    });
    return j;
}

function split_screen () {
    console.log(check_active_programs());

}