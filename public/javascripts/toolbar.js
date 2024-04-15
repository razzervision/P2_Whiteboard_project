const paint_element = document.querySelector("#paint_element");
const code_editor_element = document.querySelector("#code_editor_element");
const quiz_element = document.querySelector("#quiz_element");
const calculator_element = document.querySelector("#calculator_element");
const timer_element = document.querySelector("#timer_element");

const toolbar = document.getElementById("toolbar");

const primary_dropzone = document.querySelector("#primary_dropzone");

const paintProgram_id = document.querySelector("#paintProgram");
const codeProgram_id = document.querySelector("#codeProgram");
const quizProgram_id = document.querySelector("#quizProgram");
const calcProgram_id = document.querySelector("#calcProgram");
const timerProgram_id = document.querySelector("#timerProgram");

paintProgram_id.style.display = "none";
codeProgram_id.style.display = "none";
quizProgram_id.style.display = "none";
calcProgram_id.style.display = "none";
timerProgram_id.style.display = "block";

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

let dragged_element_x, dragged_element_y = 0;

primary_dropzone.appendChild(document.querySelector("#paintProgram"));
paintProgram_id.style.display = "block";


document.querySelectorAll('.toolbar_element').forEach(item => {
    item.addEventListener('mousedown', dragStart);
    item.addEventListener('dragstart', function(e) { e.preventDefault(); });
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
});



let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
    draggedElement = this;

    offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
    offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
    console.log(check_active_programs());
}

function drag(e) {
    if (draggedElement !== null) {
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';

        let element_to_display = div_converter(draggedElement);
        if (e.clientX < (document.querySelector("#draw_area").offsetWidth)/2) {

            split_screen(check_active_programs(), true, element_to_display);
        } else {
            split_screen(check_active_programs(), false, element_to_display);
        }
    }
    
    dragged_element_x = (e.clientX - offsetX) + 'px';
    dragged_element_y = (e.clientY - offsetY) + 'px';
}

function dragEnd() {
    const dataValue = draggedElement.getAttribute("data-value");
    const program = programs.find(program => program.value === dataValue);
    program.isActive = true;
    draggedElement = null;
}

function div_converter (draggedElement) {
    if (draggedElement != null) {
        let str = "#" + draggedElement.dataset.value;
        let elem = document.querySelector(str);
        return elem;
    }   
}

function check_active_programs () {
    let i = [];
    programs.forEach(program => {
        if (program.isActive == true) {
            i.push(program);
        }
    });
    return i;
}

function split_screen (active_programs, left_or_right, element_to_display) {
    // let new_divider = document.createElement("div");
    // document.querySelector("#draw_area").appendChild(new_divider);
    
    if (active_programs.length == 1) {

        let program_id = active_programs[0].value;
        let program_change = document.querySelector('#' + program_id);
        program_change.style.width = "70%";
        if (!left_or_right) {
            program_change.style.left = "0%";
            size_element(element_to_display, "30%", "100%", "70%", "0%");
        } else {
            program_change.style.left = "30%";
            size_element(element_to_display, "30%", "100%", "0%", "0%");
        }
    }
}

function size_element (element, width, height, left, top) {
    primary_dropzone.appendChild(element);

    element.style.display = "block";
    element.style.width = width;
    element.style.height = height;
    element.style.left = left;
    element.style.top = top;
}