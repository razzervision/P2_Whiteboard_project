const paint_element = document.querySelector("#paint_element");
const code_editor_element = document.querySelector("#code_editor_element");
const quiz_element = document.querySelector("#quiz_element");
const calculator_element = document.querySelector("#calculator_element");
const timer_element = document.querySelector("#timer_element");

const toolbar = document.getElementById("toolbar");

const primary_dropzone = document.querySelector("#primary_dropzone");

codeProgram.style.display = "none";
quizProgram.style.display = "none";
calcProgram.style.display = "none";
timerProgram.style.display = "none";
paintProgram.style.display = "none";

let dragged_element_x, dragged_element_y = 0;

primary_dropzone.appendChild(document.querySelector("#paintProgram"));
document.querySelector("#paintProgram").style.display = "block";


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
    if (draggedElement != null) {
        let str = "#" + draggedElement.dataset.value;
        let elem = document.querySelector(str);
        elem.style.display = "block";
        create_new_dropzone(1, elem);
    }   

}

function create_new_dropzone (live_features, elem) {
    let new_dropzone = document.createElement("div")
    let user_friendly_id = live_features + 1;
    new_dropzone.id = "dropzone_" + user_friendly_id;
    if (live_features == 1) {
        primary_dropzone.appendChild(new_dropzone);
        new_dropzone.style.height = "33%";
        new_dropzone.style.width = "100%";
        elem.style.height = "33%";
        elem.style.width = "100%";
        new_dropzone.appendChild(elem);
        
    }
}