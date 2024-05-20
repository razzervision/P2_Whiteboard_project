
//buttons setup
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
const changeCanvasButton = document.getElementById("changeCanvas");
const addCanvasButton = document.getElementById("addCanvas");
const options = document.getElementById("optionsForPaint");
const canvasPlace = document.getElementById("canvasPlace");
const dropzone = document.querySelector("#primaryDropzone");
//canvas setup
const canvas0 = document.getElementById("canvas0");
//set width and height
const documentWidth = document.documentElement.clientWidth;
const documentHeight = document.documentElement.clientHeight;
//socket
// const serverurl = document.location.origin;
// const window.socket = io(serverurl, { autoConnect: false });

const pdfButton = document.getElementById("buttonPDF");
const toolBar = document.getElementById("toolbar");
const nav = document.getElementById("optionsForPaint");

const pdfButtonTotalHeight = pdfButton.offsetHeight+ parseInt(window.getComputedStyle(pdfButton).marginTop)+parseInt(window.getComputedStyle(pdfButton).marginBottom);
const toolBarTotalHeight =toolBar.offsetHeight+ parseInt(window.getComputedStyle(toolBar).marginTop)+parseInt(window.getComputedStyle(toolBar).marginBottom);
const navTotalHeight =nav.offsetHeight+ parseInt(window.getComputedStyle(nav).marginTop)+parseInt(window.getComputedStyle(nav).marginBottom);
const otherHeight = (pdfButtonTotalHeight+toolBarTotalHeight+navTotalHeight + 30);
//start display
changeCanvasButton.style.backgroundColor = "blue";
//global canvas array

const globalCanvas = [canvas0];
let globalCanvasIndex = 0;

console.log(globalCanvas);
let currentCanvas = canvas0;
let currentContext= currentCanvas.getContext("2d");
let currentcanvasPosition = currentCanvas.getBoundingClientRect();

const procent = (75 / document.documentElement.clientHeight) * 100;
dropzone.style.height = (100 - procent) + "%";
dropzone.style.width = "100%";

currentCanvas.style.display = "block";
currentCanvas.style.width = "100%";
currentCanvas.style.height = (document.documentElement.clientHeight - otherHeight + "px");
const width = documentWidth;
const height = documentHeight;

currentCanvas.width = currentCanvas.clientWidth;
currentCanvas.height = currentCanvas.clientHeight;

//default canvas stuff
const startBackground = "white";
let drawColor = "black";
let drawWidth;
drawWidth = 50;
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

let singleSave = null;


// window.primDropRows();
// window.primDropColumns();


//mouse object
const mouse = {
    x: 0,
    y: 0
};

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

addCanvasButton.addEventListener("click", () => {
    addCanvas();
    window.socket.emit("addCanvas");
});

//undo
undoB.addEventListener("click", () => {
    undo();
    window.socket.emit("undo");
});

//rezize
window.addEventListener("resize", rezize);
//
window.addEventListener("scroll",rezize);

changeCanvasButton.addEventListener("click",() =>{
    changeCanvas(canvas0,changeCanvasButton);
    window.socket.emit("changeCanvas", {canvas: canvas0.id, canvasButton: changeCanvasButton.id});
});
//event listeners
clear.addEventListener("click", ()=>{
    clearCanvas();
    window.socket.emit("clearCanvas");
});

//canvas listners in beginning
currentCanvas.addEventListener("pointerdown", pointerDown);
currentCanvas.addEventListener("pointerout",stopDraw);

//picture
pictureLocation.addEventListener("click",choseLocation);
uploadInput.addEventListener("change", () => {
    uploadePicture();
});

function stopDraw(){
    currentCanvas.removeEventListener("pointermove", onMouseMove);
    currentContext.closePath();
}


function redrawCanvas() {
    currentContext.putImageData(singleSave, 0, 0);

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
        canvas.width = currentCanvas.width;
        canvas.height = currentCanvas.height;
    
        canvasButton.addEventListener("click", () =>{
            changeCanvas(canvas,canvasButton);
            window.socket.emit("changeCanvas", {canvas: canvas.id, canvasButton: canvasButton.id});
        });
    
        changeCanvas(canvas,canvasButton);
        options.appendChild(canvasButton);
        canvasCounter++;
        
    }
}


//functions
function ChoseCanvasLocation(event) {
    imgX = window.scrollX + event.clientX - currentcanvasPosition.left;
    imgY = window.scrollY + event.clientY - currentcanvasPosition.top;
    console.log(imgX, " & ", imgY);
    currentCanvas.addEventListener("pointerdown", pointerDown);
}

function choseLocation(){
    currentCanvas.removeEventListener("pointermove", onMouseMove);
    currentCanvas.removeEventListener("pointerdown", pointerDown);
    currentCanvas.removeEventListener("pointerup", removeMouseMove);
    currentCanvas.addEventListener("pointerdown", ChoseCanvasLocation);
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
    mouse.x = window.scrollX + event.clientX - currentcanvasPosition.left;
    mouse.y = window.scrollY + event.clientY - currentcanvasPosition.top;
    dot();
    currentCanvas.addEventListener("pointermove", onMouseMove);
    currentCanvas.addEventListener("pointerup", bindeled);
}

function bindeled (){
    removeMouseMove();
    window.socket.emit("removeMouse");
}


function dot() {
    currentContext.beginPath();
    currentContext.moveTo(mouse.x, mouse.y);
    console.log(mouse.x, mouse.y);
    draw();
}
function onMouseMove(event) {
    mouse.x = window.scrollX + event.clientX - currentcanvasPosition.left;
    mouse.y = window.scrollY + event.clientY - currentcanvasPosition.top;
    draw();
}
function removeMouseMove() {
    undoarray[globalCanvasIndex].push(currentContext.getImageData(0, 0, currentCanvas.width, currentCanvas.height));
    console.log(undoarray[globalCanvasIndex].length);
    currentCanvas.removeEventListener("pointermove", onMouseMove);
    currentContext.closePath();
    currentCanvas.removeEventListener("pointerup",bindeled);
}

function draw() {
    currentContext.strokeStyle = drawColor;
    currentContext.lineWidth = drawWidth;
    currentContext.lineCap = "round";
    currentContext.lineJoin = "round";
    currentContext.lineTo(mouse.x, mouse.y);
    
    currentContext.stroke();
    window.socket.emit("draw", {
        x: mouse.x,
        y: mouse.y,
        color: drawColor,
        width: drawWidth
    });
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
    canvasT.style.height = (document.documentElement.clientHeight - otherHeight+"px");
    canvasT.addEventListener("pointerdown",pointerDown);
    canvasT.addEventListener("pointerout",stopDraw);
    canvasT.width = canvasT.clientWidth;
    canvasT.height = canvasT.clientHeight;
    
    currentCanvas = canvasT;
    console.log(currentCanvas);
    currentContext = currentCanvas.getContext("2d");
    currentcanvasPosition = currentCanvas.getBoundingClientRect();
    extraReDraw();
}
    
function extraReDraw(){
    const AA = undoarray[globalCanvasIndex].length - 1;
    if(undoarray[globalCanvasIndex].length > 0){
        currentContext.putImageData(undoarray[globalCanvasIndex][AA], 0, 0);  
    }
}

function rezize () {
    const procent = (75 / document.documentElement.clientHeight) * 100;
    console.log(procent);
    // dropzone.style.height = (100 - procent) + "%";
    // dropzone.style.width = "100%";

    currentCanvas.style.display = "block";
    currentCanvas.style.width = "100%";
    currentCanvas.style.height = (document.documentElement.clientHeight - otherHeight+"px");
    console.log(document.documentElement.clientHeight * (1-(75 / document.documentElement.clientHeight))+"px");

    singleSave = currentContext.getImageData(0, 0, currentCanvas.width, currentCanvas.height);

    currentCanvas.width = currentCanvas.clientWidth;
    currentCanvas.height = currentCanvas.clientHeight;
    
    redrawCanvas();

    console.log(width, height);
    /*
    currentContext.fillStyle = startBackground;
    currentContext.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
    currentContext.putImageData(undoarray[globalCanvasIndex].length, 0, 0);
    currentcanvasPosition = currentCanvas.getBoundingClientRect(); 
    */
}

window.resizeCanvas = rezize;

function changeColor(element) {
    drawColor = element.style.backgroundColor;
}

function uploadePicture(){
    const img = new Image();
    const pictureUpload = document.getElementById("uploadInput");
    img.src = URL.createObjectURL(pictureUpload.files[0]);
    img.onload = function(){
        if(imgheightButton.value>= currentCanvas.height && imgwithdButton.value>= currentCanvas.width){
            img.width = currentCanvas.width;
            img.height = currentCanvas.height;  
        }else if(imgheightButton.value>= currentCanvas.height){
            img.height = currentCanvas.height;
            img.width = imgwithdButton.value;
        }else if(imgwithdButton.value>= currentCanvas.width){
            img.width = currentCanvas.width;
            img.height = imgheightButton.value;
        }else{
            img.height = imgheightButton.value;
            img.width = imgwithdButton.value;
        }
        
        const formData = new FormData();
        formData.append("xPosition", imgX);
        formData.append("yPosition", imgY);
        formData.append("pictureWidth", img.width);
        formData.append("pictureHeight", img.height);
        formData.append("picture", pictureUpload.files[0]);

        fetch("/api/postPicture", {
            method: "POST",
            body: formData
        }).then(response => {
            if (response.status === 200) {
                console.log("picture uploaded");
                window.socket.emit("uploadePicture");
            } else {
                console.log("error in uploading picture");
                console.error("Server responded with status:", response.status);
            }
        }).catch(err => {
            console.error("Failed to upload picture:", err);
        });

        currentContext.drawImage(img, imgX, imgY, img.width, img.height);
    };
    img.onerror = function(){
        console.log("img load fail");
    };
}

//sockets

window.socket.on("draw", function (data) {
    currentContext.beginPath();
    currentContext.moveTo(data.x, data.y);
    currentContext.strokeStyle = data.color;
    currentContext.lineWidth = data.width;
    currentContext.lineCap = "round";
    currentContext.lineJoin = "round";
    currentContext.lineTo(data.x, data.y);
    currentContext.stroke();
});

window.socket.on("clearCanvas", function () {
    clearCanvas();
});

window.socket.on("addCanvas", () =>{
    addCanvas();
});

window.socket.on("changeCanvas", (data) =>{
    const canvasButton = document.getElementById(data.canvasButton);
    const canvasT = document.getElementById(data.canvas);
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

    const canvasId = data.canvas;
    globalCanvasIndex = canvasId[6];


    canvasButton.style.backgroundColor = "blue";
    canvasT.style.display = "block";
    canvasT.style.width = "100%";
    canvasT.style.height = (document.documentElement.clientHeight - otherHeight+"px");
    canvasT.addEventListener("pointerdown",pointerDown);
    canvasT.addEventListener("pointerout",stopDraw);
    
    currentCanvas = canvasT;
    console.log(currentCanvas);
    currentContext = currentCanvas.getContext("2d");
    currentcanvasPosition = currentCanvas.getBoundingClientRect();
});


window.socket.on("removeMouse", () =>{
    removeMouseMove();
});

window.socket.on("undo", () =>{
    undo();
});

window.socket.on("uploadePicture", async () => {
    try {
        const response = await fetch("/api/getPicture");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        const img = new Image();
        img.src = `data:image/jpeg;base64,${data.picture}`;
        img.onload = function() {
            currentContext.drawImage(img, data.xPosition, data.yPosition, data.pictureWidth, data.pictureHeight);
        };
        img.onerror = function() {
            console.error("Error loading image.");
        };
    } catch (error) {
        console.error("Failed to fetch and display picture:", error);
    }
});