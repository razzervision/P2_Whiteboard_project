import { io } from "socket.io-client";
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = 600;


const startBackground = "white";
let draw_color = "black";
const draw_withd = "50";
let is_drawing = false;


const context = canvas.getContext("2d");
context.fillStyle = startBackground;
context.fillRect(0,0,canvas.width,canvas.height);

function changeColor(element){
    draw_color = element.style.backgroundColor;
}

canvas.addEventListener("touchstart",start);
canvas.addEventListener("touchmove",draw);
canvas.addEventListener("mousedown",start);
canvas.addEventListener("mousemove",draw);

canvas.addEventListener("touchend",stop);
canvas.addEventListener("mouseup",stop);
canvas.addEventListener("mouseout",stop);


function start(event){
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

}

function draw(event) {
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_withd;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        io.emit("draw", {
            x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop,
            color: draw_color,
            width: draw_withd
        });
    }
}

function stop(event){
    if (is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;
    }

}

function clearCanvas() {
    context.fillStyle = startBackground;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);

}