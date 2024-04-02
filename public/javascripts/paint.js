//here we get element id of canvas and determin its hight and width
const canvas = document.getElementById("canvas");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

// io
const socket = io("http://localhost:3000");

canvas.width = width;
canvas.height = height;
//initilize some variables essential for the program
const startBackground = "white";
let draw_color = "black";
const draw_withd = "50";
let is_drawing = false;
//let phone = false;

//1 is pensel, 2 is rectangels, idk rest
const selectedTool = 1;

//used for undo function
let undoarray = [];
let undoindex = -1;

//here we make a essential variable context that you can use to change the
//context of the canvas
const context = canvas.getContext("2d");
context.lineCap = "round";
context.lineJoin = "round";
//then we fill background so its white and determin it should be white from starting point
//0,0 because the canvas starts in the top left cornor. Then it should fill canvas width x canvas hight in
context.fillStyle = startBackground;
context.fillRect(0,0,canvas.width,canvas.height);

const canvasPosition = canvas.getBoundingClientRect();

//this function works together with buttons in the html file to change draw_color
function changeColor(element){
    draw_color = element.style.backgroundColor;
}

const mouse ={
    x : canvas.width/2,
    y : canvas.height/2
};

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    stopTouchScrolling(canvas);
   // phone = true;
}


//here is all the addEventListeners that tells us when to start drawing.
//touch is ment for screens you touch such as phones while mouse is for mouse.
/*
canvas.addEventListener("touchstart",function (event) {
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
    start(mouse);
});

canvas.addEventListener("touchmove", function (event) {
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

    draw(mouse);
});
canvas.addEventListener("touchend",stop);
*/
canvas.addEventListener("pointerdown", function(event){
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
    start(mouse);
});

canvas.addEventListener("pointermove", function(event){
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

    draw(mouse);
});

//here is the reasons to stop drawing. lift finger from phone or mouse up
//or you moving mouse outside of the object canvas.
canvas.addEventListener("pointerup",stop);
canvas.addEventListener("pointerout",stop);

//function that starts a path
function start(mouse){
    is_drawing = true;
    context.beginPath();
    //set start cordinat on canvas for path.
    context.moveTo(mouse.x, mouse.y);
    brush(mouse);

    //send to server that we are starting to draw
    socket.emit("draw", {action: "start", x: mouse.x, y: mouse.y, color: draw_color, width: draw_withd});
 
    //run brush one time so that if you click one time you will still have drawn a dot.
}

//draw function is called continuesly and depending on the selected tool do different stuff.
function draw(mouse) {
    if (is_drawing) {
        if (selectedTool === 1){
            brush(mouse);

            //send to server that we are drawing
            socket.emit("draw", {action: "draw", x: mouse.x, y: mouse.y, color: draw_color, width: draw_withd});
        }else if (selectedTool === 2){
        
        }
    
    }
}

//brush is one of the selected tools. And can draw.
function brush(mouse){
    context.strokeStyle = draw_color;
    context.lineWidth = draw_withd;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
   
}

//stop is the function that is called when we want to stop drawing
function stop(event){
    if (is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;

        //send to server that we are done drawing
        socket.emit("draw", {action: "stop", x: mouse.x, y: mouse.y, color: draw_color, width: draw_withd});

        //here we with the consept of a stack save a image of the canvas in undoarray
        undoarray.push(context.getImageData(0,0,canvas.width,canvas.height));
        undoindex +=1;
    }
}

//this function is a reset for the canvas and resets the canvas's context
function clearCanvas() {
    context.fillStyle = startBackground;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);

    socket.emit("clearCanvas");

    //resets undofunction
    undoarray = [];
    undoindex = -1;
}

//undo function that makes it possible to undo stuff
function undo() {
    //if the undoarrays index is 0 or less then we might as well clear canvas.
    if(undoindex <= 0){
        clearCanvas();
    } else {
        //else we just want to go one back therefore remove the top layer of the stack
        undoindex -=1;
        undoarray.pop();
        //here we wanty to insert the last saved in the undo into the canvas.
        context.putImageData(undoarray[undoindex],0,0);
    }
}

window.addEventListener("resize",function(){
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    console.log(width,height);
    context.fillStyle = startBackground;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.putImageData(undoarray[undoindex],0,0);
});

// socket.io receive data from server and draw it on canvas
socket.on("draw", (data) => {
    const { action, x, y, color, width } = data;

    context.strokeStyle = color;
    context.lineWidth = width;

    if (action === "start") {
        context.beginPath();
        context.moveTo(x, y);
    } else if (action === "draw") {
        context.lineTo(x, y);
        context.stroke();
    } else if (action === "stop") {
        context.closePath();
    }
});

// socket.io clear canvas
socket.on("clearCanvas", () => {
    clearCanvas();
});