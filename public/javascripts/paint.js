//buttons setup
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
const changeCanvasButton = document.getElementById("changeCanvas");
const addCanvasButton = document.getElementById("addCanvas");
const options = document.getElementById("optionsForPaint");
const canvasPlace = document.getElementById("canvasPlace");
//canvas setup
const canvas0 = document.getElementById("canvas0");
//context
const context = canvas0.getContext("2d");
//set width and height
let width = canvas0.offsetWidth;
let height = canvas0.offsetHeight;


//start display
canvas0.style.display = "block";
canvas0.style.width = "100%";
canvas0.style.height = "77.5%";
changeCanvasButton.style.backgroundColor = "blue";

canvas0.width = width;
canvas0.height = height;

//global canvas array

const globalCanvas = [canvas0];
let globalCanvasIndex = 0;

console.log(globalCanvas);
let currentCanvas = canvas0;
let currentContext= currentCanvas.getContext("2d");
let currentcanvasPosition = currentCanvas.getBoundingClientRect();
//default canvas stuff
const startBackground = "white";
let drawColor = "black";
const draw_withd = 50;
//make background white
currentContext.fillStyle = startBackground;
currentContext.fillRect(0, 0, canvas0.width, canvas0.height);

//picture upload
const pictureLocation = document.getElementById("picture location");
const uploadInput = document.getElementById("uploadInput");
const imgheightButton = document.getElementById("Imgheight");
const imgwithdButton = document.getElementById("Imgwithd");

//undo array
const undoarray = [[]];


//start position of picture
let imgX = 0;
let imgY = 0;

// max canvases
const maxCanvas = 9;
let canvasCounter = 1;


//mouse object
const mouse = {
    x: 0,
    y: 0
};


addCanvasButton.addEventListener("click",addCanvas);

//undo
undoB.addEventListener("click", undo);
//rezize
window.addEventListener("resize", rezize);
//

changeCanvasButton.addEventListener("click",() =>{
    changeCanvas(canvas0,changeCanvasButton);
});
//event listeners
clear.addEventListener("click", clearCanvas);

//canvas listners in beginning
currentCanvas.addEventListener("pointerdown", pointerDown);
currentCanvas.addEventListener("pointerout",stopDraw);

//picture
pictureLocation.addEventListener("click",choseLocation);
uploadInput.addEventListener("change", uploadePicture);

function stopDraw(){
    currentCanvas.removeEventListener("pointermove", onMouseMove);
    currentContext.closePath();
}

function addCanvas(){
    if(canvasCounter <= maxCanvas){
        const totalCanvasLenght = globalCanvas.length;
        const canvasButton = document.createElement("button");
        canvasButton.id = "canvasButton" + totalCanvasLenght;
        canvasButton.className ="canvasButton";
        canvasButton.textContent ="C"+ totalCanvasLenght;
    
        const canvas = document.createElement("canvas");
        canvas.id = "canvas" + totalCanvasLenght;
        console.log(canvas);
        canvasPlace.appendChild(canvas);

        undoarray.push([]);

        globalCanvas.push(canvas);
        canvas.width = width;
        canvas.height = height;
    
        canvasButton.addEventListener("click", () =>{
            changeCanvas(canvas,canvasButton);
        });
    
        changeCanvas(canvas,canvasButton);
        options.appendChild(canvasButton);
        canvasCounter++;
    }
}


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
    console.log(undoarray[globalCanvasIndex].length);
    if (undoarray[globalCanvasIndex].length === 1) {
        console.log("hej med dig");
        clearCanvas();
    } else {
        undoarray[globalCanvasIndex].pop();
        const Alenght = undoarray[globalCanvasIndex].length - 1;
        currentContext.putImageData(undoarray[globalCanvasIndex][Alenght], 0, 0);
    } 
}

function pointerDown(event){
    currentCanvas.removeEventListener("pointerdown", ChoseCanvasLocation);
    event.preventDefault();
    mouse.x = event.clientX - currentcanvasPosition.left;
    mouse.y = event.clientY - currentcanvasPosition.top;
    dot(event);
    currentCanvas.addEventListener("pointermove", onMouseMove);
    currentCanvas.addEventListener("pointerup", removeMouseMove);
}

function dot() {
    currentContext.beginPath();
    currentContext.moveTo(mouse.x, mouse.y);
    console.log(mouse.x, mouse.y);
    draw();
}
function onMouseMove(event) {
    mouse.x = event.clientX - currentcanvasPosition.left;
    mouse.y = event.clientY - currentcanvasPosition.top;
    draw();
}
function removeMouseMove() {
    undoarray[globalCanvasIndex].push(currentContext.getImageData(0, 0, currentCanvas.width, currentCanvas.height));
    currentCanvas.removeEventListener("pointermove", onMouseMove);
    currentContext.closePath();
}
function draw() {
    currentContext.strokeStyle = drawColor;
    currentContext.lineWidth = draw_withd;
    currentContext.lineCap = "round";
    currentContext.lineJoin = "round";
    currentContext.lineTo(mouse.x, mouse.y);
    
    currentContext.stroke();
}


function clearCanvas() {
    currentContext.fillStyle = startBackground;
    currentContext.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
    currentContext.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
    console.log(undoarray);
    const currentLenght= undoarray[globalCanvasIndex].length - 1;
    console.log(currentLenght);
    const saveData= undoarray[globalCanvasIndex][currentLenght];
    undoarray[globalCanvasIndex] = [];
    undoarray[globalCanvasIndex][0] = saveData;
    undoarray[globalCanvasIndex][1] = saveData;
    console.log(undoarray);
}

function changeCanvas(canvasT,canvasButton){

    globalCanvas.forEach(C => {
        C.style.display = "none";
        C.style.width = "0%";
        C.style.height = "0%";
        C.removeEventListener("pointerdown",pointerDown);
        C.removeEventListener("pointermove", onMouseMove);
        C.removeEventListener("pointerout",stopDraw);
    });
    const allButtons = document.querySelectorAll(".canvasButton");
    allButtons.forEach(b => {
        b.style.backgroundColor = "white";
    });

    const canvasId = canvasT.id;
    globalCanvasIndex = canvasId[6];


    canvasButton.style.backgroundColor = "blue";
    canvasT.style.display = "block";
    canvasT.style.width = "100%";
    canvasT.style.height = "77.5%";
    canvasT.addEventListener("pointerdown",pointerDown);
    canvasT.addEventListener("pointerout",stopDraw);
    
    currentCanvas = canvasT;
    console.log(currentCanvas);
    currentContext = currentCanvas.getContext("2d");
    currentcanvasPosition = currentCanvas.getBoundingClientRect();

}
    
    
function rezize () {
    width = currentCanvas.offsetWidth;
    height = currentCanvas.offsetHeight;
    
    currentCanvas.width = width;
    currentCanvas.height = height;
    console.log(width, height);
    //context.fillStyle = startBackground;
    //context.fillRect(0, 0, canvas.width, canvas.height);
    //context.putImageData(undoarray[undoindex], 0, 0);
    //canvasPosition = canvas.getBoundingClientRect(); 
}


function changeColor(element) {
    drawColor = element.style.backgroundColor;
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
let drawColor = "black";
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
        color: drawColor,
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
        color: drawColor,
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
    context.strokeStyle = drawColor;
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
    drawColor = element.style.backgroundColor;
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

