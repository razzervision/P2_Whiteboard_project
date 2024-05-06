//buttons setup
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
const changeCanvasButton = document.getElementById("changeCanvas");
const changeCanvasButton1 = document.getElementById("changeCanvas1");
//canvas setup
const canvas = document.getElementById("canvas");
const canvas1 = document.getElementById("canvas1");
//context
const context = canvas.getContext("2d");
const context1 = canvas1.getContext("2d");
//set width and height
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;


//start display
canvas1.style.display = 'none';
canvas.style.display = 'block';
canvas.style.width = '100%';
canvas.style.height = '77.5%';



canvas.width = width;
canvas.height = height;

canvas1.width = width;
canvas1.height = height;

//global canvas array

let globalCanvas = [];
globalCanvas.push(canvas,canvas1);
console.log(globalCanvas);
let currentCanvas = canvas;
//default canvas stuff
const startBackground = "white";
let draw_color = "black";
let draw_withd = 50;
//make background white
context.fillStyle = startBackground;
context.fillRect(0, 0, canvas.width, canvas.height);
context1.fillStyle = "green";
context1.fillRect(0, 0, canvas1.width, canvas1.height);
//canvasNumber
let canvasNumber = 1;
let canvasPosition = canvas.getBoundingClientRect();
let canvasPosition1 = canvas1.getBoundingClientRect();

//picture upload
const pictureLocation = document.getElementById("picture location");
const uploadInput = document.getElementById("uploadInput");
const imgheightButton = document.getElementById("Imgheight");
const imgwithdButton = document.getElementById("Imgwithd");

//undo array
let undoarray = [];
let undoindex = -1;

let undoarray1 = [];
let undoindex1 = -1;

//start position of picture
let imgX = 0;
let imgY = 0;



//mouse object
const mouse = {
    x: 0,
    y: 0
};
//undo
undoB.addEventListener("click", undo);
//rezize
window.addEventListener("resize", rezize);
//
changeCanvasButton1.addEventListener("click",() => {
    changeCanvas(canvas1);
});
changeCanvasButton.addEventListener("click",() =>{
    changeCanvas(canvas);
});
//event listeners
clear.addEventListener("click", () =>
{canvasNumber == 1 ? clearCanvas() : clearCanvas1();}
);

//canvas listners in beginning
canvas.addEventListener("pointerdown", pointerDown);
canvas.addEventListener("pointerout", removeMouseMove);

//picture
pictureLocation.addEventListener("click",choseLocation);
uploadInput.addEventListener("change", uploadePicture);


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

function undo() {
    if(canvasNumber == 1){
        if (undoindex <= 0) {
            clearCanvas();
        } else {
            undoindex -= 1;
            undoarray.pop();
            context.putImageData(undoarray[undoindex], 0, 0);
        } 
    }else{
        if(undoindex1 <= 0){
            clearCanvas1();
        }else{
            undoindex1 = -1;
            undoarray1.pop();
            context1.putImageData(undoarray1[undoindex1], 0, 0);
        }

    }
}

function pointerDown(event){
    canvas.removeEventListener("pointerdown", ChoseCanvasLocation);
        event.preventDefault();
        mouse.x = event.clientX - canvasPosition.left;
        mouse.y = event.clientY - canvasPosition.top;
        dot(event);
        canvas.addEventListener("pointermove", onMouseMove);
        canvas.addEventListener("pointerup", removeMouseMove);
};

function dot(input) {
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
    console.log(mouse.x, mouse.y);
    draw();
}
function onMouseMove(event) {
    mouse.x = event.clientX - canvasPosition.left;
    mouse.y = event.clientY - canvasPosition.top;
    draw();
}
function removeMouseMove() {
    undoarray.push(context.getImageData(0, 0, canvas.width, canvas.height));
    undoindex += 1;
    canvas.removeEventListener("pointermove", onMouseMove);
    context.closePath();
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


function changeCanvas(canvasT){

    globalCanvas.forEach(C => {
        C.style.display = 'none';
        C.style.width = '0%'
        C.style.height = '0%';
        C.removeEventListener("pointerdown",pointerDown1);
        C.removeEventListener("pointerout", removeMouseMove1);
        C.removeEventListener("pointermove", onMouseMove1);
    });
        canvasT.style.display = 'block';
        canvasT.style.width = '100%';
        canvasT.style.height = '77.5%';
        canvasT.addEventListener("pointerdown",pointerDown1);
        canvasT.addEventListener("pointerout", removeMouseMove1);
    
        currentCanvas = canvasT;
}
    
    
    function rezize () {
        if(canvasNumber == 1){
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
        
            canvas.width = width;
            canvas.height = height;
            console.log(width, height);
            context.fillStyle = startBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.putImageData(undoarray[undoindex], 0, 0);
            canvasPosition = canvas.getBoundingClientRect(); 
        }else{
            width = canvas1.offsetWidth;
            height = canvas1.offsetHeight;
        
            canvas1.width = width;
            canvas1.height = height;
            console.log(width, height);
            context1.fillStyle = startBackground;
            context1.fillRect(0, 0, canvas1.width, canvas1.height);
            context1.putImageData(undoarray1[undoindex1], 0, 0);
            canvasPosition1 = canvas1.getBoundingClientRect();
        }
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

//canvas 1:
function pointerDown1(event){
        event.preventDefault();
        mouse.x = event.clientX - canvasPosition1.left;
        mouse.y = event.clientY - canvasPosition1.top;
        dot1(event);
        canvas1.addEventListener("pointermove", onMouseMove1);
        canvas1.addEventListener("pointerup", removeMouseMove1);
};
function dot1(input) {
    context1.beginPath();
    context1.moveTo(mouse.x, mouse.y);
    console.log(mouse.x, mouse.y);
    draw1();
}
function onMouseMove1(event) {
    mouse.x = event.clientX - canvasPosition1.left;
    mouse.y = event.clientY - canvasPosition1.top;
    draw1();
}
function removeMouseMove1() {
    undoarray.push(context1.getImageData(0, 0, canvas1.width, canvas1.height));
    undoindex1 += 1;
    canvas1.removeEventListener("pointermove", onMouseMove1);
    context1.closePath();
}
function draw1() {
    context1.strokeStyle = draw_color;
    context1.lineWidth = draw_withd;
    context1.lineCap = "round";
    context1.lineJoin = "round";
    context1.lineTo(mouse.x, mouse.y);
    context1.fillStyle = "rgba("+(mouse.x % 255)+","+(mouse.y % 255)+","+((mouse.x % 255) + (mouse.y % 255))+",1)";
    context1.fillRect(0, 0, canvas1.width, canvas1.height);
    context1.stroke();
}
function clearCanvas1() {
    console.log("hej med dig");
    context1.fillStyle = startBackground;
    context1.clearRect(0, 0, canvas1.width, canvas1.height);
    context1.fillRect(0, 0, canvas1.width, canvas1.height);

    undoarray1 = [];
    undoindex1 = -1;
}






































/*
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
const draw_withd = 50;
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
const socket = io(serverurl, { autoConnect: false });

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
}


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
}

function changeColor(element) {
    draw_color = element.style.backgroundColor;
}

function uploadePicture(){
    const img = new Image();
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
    };
    img.onerror = function(){
        console.log("img load fail");
    };

}

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

*/