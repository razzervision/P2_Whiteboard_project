const canvas = document.getElementById("canvas");
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;
canvas.width = width;
canvas.height = height;
const startBackground = "white";
let draw_color = "black";
const draw_withd = 50;
const context = canvas.getContext("2d");
context.fillStyle = startBackground;
context.fillRect(0, 0, canvas.width, canvas.height);
let canvasPosition = canvas.getBoundingClientRect();
const drawing = true;
let undoarray = [];
let undoindex = -1;
const serverurl = document.location.origin;
const socket = io(serverurl);

const mouse = {
    x: 0,
    y: 0
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
        
        socket.emit("draw", {
            x: mouse.x,
            y: mouse.y,
            color: draw_color,
            width: draw_withd
        });
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
    socket.emit("clearCanvas");
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

socket.on("draw", function (data) {
    context.strokeStyle = data.color;
    context.lineWidth = data.width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(data.x, data.y);
    context.stroke();
});

socket.on("clearCanvas", function () {
    clearCanvas();
});