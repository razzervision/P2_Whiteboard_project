const canvas = document.getElementById("canvas");
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
const uploadInput = document.getElementById("uploadInput");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;
canvas.width = width;
canvas.height = height;
const startBackground = "white";
let draw_color = "black";
let draw_withd = 50;
const context = canvas.getContext("2d");
context.fillStyle = startBackground;
context.fillRect(0, 0, canvas.width, canvas.height);
let canvasPosition = canvas.getBoundingClientRect();
let firstClick = { x: 0, y: 0 };
let secondClick = { x: 0, y: 0 };
let clickCount = 0;
var drawing = true;
let undoarray = [];
let undoindex = -1;

const mouse = {
    x: 0,
    y: 0,
};

canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    // Now mouse.x and mouse.y contain the current mouse coordinates
});

clear.addEventListener("click", clearCanvas);
undoB.addEventListener("click", undo);

    canvas.addEventListener("pointerdown", function (event) {
        if(drawing){
            event.preventDefault();
            mouse.x = event.clientX - canvasPosition.left;
            mouse.y = event.clientY - canvasPosition.top;
            dot(event);
            canvas.addEventListener("pointermove", onMouseMove);
            canvas.addEventListener("pointerup", removeMouseMove);
        }
    });

function onMouseMove(event) {
    mouse.x = event.clientX - canvasPosition.left;
    mouse.y = event.clientY - canvasPosition.top;
    draw();
}

function removeMouseMove() {
    undoarray.push(context.getImageData(0, 0, canvas.width, canvas.height));
    undoindex += 1;
    canvas.removeEventListener("pointermove", onMouseMove);
}

function dot(input) {
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
    console.log(mouse.x, mouse.y);
    draw();
}

function draw() {
    context.strokeStyle = draw_color;
    context.lineWidth = draw_withd;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function clearCanvas() {
    context.fillStyle = startBackground;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    undoarray = [];
    undoindex = -1;
}

function undo() {
    //if the undoarrays index is 0 or less then we might as well clear canvas.
    if (undoindex <= 0) {
        clearCanvas();
    } else {
        //else we just want to go one back therefore remove the top layer of the stack
        undoindex -= 1;
        undoarray.pop();
        //here we wanty to insert the last saved in the undo into the canvas.
        context.putImageData(undoarray[undoindex], 0, 0);
    }
}

window.addEventListener("resize", function () {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;
    console.log(width, height);
    context.fillStyle = startBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.putImageData(undoarray[undoindex], 0, 0);
    canvasPosition = canvas.getBoundingClientRect();
});

function changeColor(element) {
    draw_color = element.style.backgroundColor;
}