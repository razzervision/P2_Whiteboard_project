//canvas setup
const canvas = document.getElementById("canvas");
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");

let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

canvas.width = width;
canvas.height = height;

//default canvas stuff
const startBackground = "white";
let draw_color = "black";
let draw_withd = 50;
const context = canvas.getContext("2d");
context.fillStyle = startBackground;
context.fillRect(0, 0, canvas.width, canvas.height);
let canvasPosition = canvas.getBoundingClientRect();

//picture upload
const pictureLocation = document.getElementById("picture location");
const uploadInput = document.getElementById("uploadInput");
const imgheightButton =document.getElementById("Imgheight");
const imgwithdButton = document.getElementById("Imgwithd");

//start position of picture
let imgX = 0;
let imgY = 0;


//undo array
let undoarray = [];
let undoindex = -1;

//sockets
const serverurl = document.location.origin;
const socket = io(serverurl);

//mouse object
const mouse = {
    x: 0,
    y: 0
};

//event listeners
clear.addEventListener("click", clearCanvas);
undoB.addEventListener("click", undo);
pictureLocation.addEventListener("click",choseLocation);

uploadInput.addEventListener("change", uploadePicture);
window.addEventListener("resize", rezize);
canvas.addEventListener("pointerdown", pointerDown);


//functions

function ChoseCanvasLocation(event) {
    imgX = event.clientX - canvasPosition.left;
    imgY = event.clientY - canvasPosition.top;
    console.log(imgX, " & ", imgY);
    canvas.addEventListener("pointerdown", pointerDown);
}

function choseLocation(){
    canvas.removeEventListener("pointermove", onMouseMove);
    canvas.removeEventListener("pointerdown", pointerDown);
    canvas.removeEventListener("pointerup", removeMouseMove);
    canvas.addEventListener("pointerdown", ChoseCanvasLocation);
}

function pointerDown(event){
    canvas.removeEventListener("pointerdown", ChoseCanvasLocation);
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
};


function onMouseMove(event) {
    mouse.x = event.clientX - canvasPosition.left;
    mouse.y = event.clientY - canvasPosition.top;
    draw();
    socket.emit("draw", {
        x: mouse.x,
        y: mouse.y,
        color: draw_color,
        width: draw_withd
    });
}

function removeMouseMove() {
    undoarray.push(context.getImageData(0, 0, canvas.width, canvas.height));
    undoindex += 1;
    canvas.removeEventListener("pointermove", onMouseMove);
    context.closePath();
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
    if (undoindex <= 0) {
        clearCanvas();
    } else {
        undoindex -= 1;
        undoarray.pop();
        context.putImageData(undoarray[undoindex], 0, 0);
    }
}

function rezize () {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;
    console.log(width, height);
    context.fillStyle = startBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.putImageData(undoarray[undoindex], 0, 0);
    canvasPosition = canvas.getBoundingClientRect();
};

function changeColor(element) {
    draw_color = element.style.backgroundColor;
}

function uploadePicture(){
    var img = new Image();
    img.src = URL.createObjectURL(this.files[0]);
    img.onload = function(){
        if(imgheightButton.value>= canvas.height || imgwithdButton.value>= canvas.width){
            img.width = canvas.width;
            img.height = canvas.height;  
        }else if(imgheightButton.value>= canvas.height){
            img.height = canvas.height;
            img.width = imgwithdButton.value;
        }else if(imgwithdButton.value>= canvas.width){
            img.width = canvas.width;
            img.height = imgheightButton.value;
        }else{
            img.height = imgheightButton.value;
            img.width = imgwithdButton.value;
        }
        context.drawImage(img, imgX, imgY, img.width, img.height);
    }
    img.onerror = function(){
        console.log("img load fail");
    }
};

//sockets

socket.on("draw", function (data) {
    context.moveTo(data.x, data.y);
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