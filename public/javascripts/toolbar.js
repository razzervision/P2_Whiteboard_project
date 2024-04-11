const paint_element = document.querySelector("#paint_element");
const code_editor_element = document.querySelector("#code_editor_element");
const quiz_element = document.querySelector("#quiz_element");
const calculator_element = document.querySelector("#calculator_element");
const timer_element = document.querySelector("#timer_element");

const toolbar = document.getElementById("toolbar");

codeProgram.style.display = "none";
quizProgram.style.display = "none";
calcProgram.style.display = "none";
timerProgram.style.display = "none";
paintProgram.style.display = "none";

let dragged_element_x, dragged_element_y = 0;


document.querySelectorAll('.toolbar_element').forEach(item => {
    item.addEventListener('mousedown', dragStart);
    item.addEventListener('dragstart', function(e) { e.preventDefault(); });
});

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

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
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = (e.clientX - offsetX) + 'px';
        draggedElement.style.top = (e.clientY - offsetY) + 'px';
    }
    dragged_element_x = (e.clientX - offsetX) + 'px';
    dragged_element_y = (e.clientY - offsetY) + 'px';
}

function dragEnd() {
    div_converter(draggedElement);
    draggedElement = null;
}

function div_converter (draggedElement) {
    console.log(draggedElement.dataset.value);
    let str = "#" + draggedElement.dataset.value;
    let elem = document.querySelector(str);
    elem.style.display = "block";
    elem.style.left = dragged_element_x;
    elem.style.top = dragged_element_y;
}