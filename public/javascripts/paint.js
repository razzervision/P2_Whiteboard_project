//here we get element id of canvas and determin its hight and width
const canvas = document.getElementById("canvas");
const paintProgra2m = document.getElementById("paintProgram");
let width = (paintProgra2m.offsetWidth - canvas.offsetWidth)-paintProgra2m.offsetWidth;
let height = (paintProgra2m.offsetHeight - canvas.offsetHeight)-canvas.offsetHeight;

canvas.width = width;
canvas.height = height;
console.log(width,height);
//initilize some variables essential for the program
let startBackground = "white";
let draw_color = "black";
let draw_withd = "50";
let is_drawing = false;
let phone = false;

//1 is pensel, 2 is rectangels, idk rest
let selectedTool = 1;

//used for undo function
let undoarray = [];
let undoindex = -1;

//here we make a essential variable context that you can use to change the
//context of the canvas
let context = canvas.getContext("2d");
//then we fill background so its white and determin it should be white from starting point
//0,0 because the canvas starts in the top left cornor. Then it should fill canvas width x canvas hight in
context.fillStyle = startBackground;
context.fillRect(0,0,canvas.width,canvas.height);


//this function works together with buttons in the html file to change draw_color
function changeColor(element){
    draw_color = element.style.backgroundColor;
}


if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    stopTouchScrolling(canvas);
    phone = true;
}






//here is all the addEventListeners that tells us when to start drawing.
//touch is ment for screens you touch such as phones while mouse is for mouse.
canvas.addEventListener("touchstart",function (event) {
    event.preventDefault();
    var touch = event.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    start(mouseEvent);
});

canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
    var touch = event.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
});

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);


//here is the reasons to stop drawing. lift finger from phone or mouse up
//or you moving mouse outside of the object canvas.
canvas.addEventListener("touchend",stop);
canvas.addEventListener("mouseup",stop);
canvas.addEventListener("mouseout",stop);

//function that starts a path
function start(event,mouseEvent){
   is_drawing = true;
   context.beginPath();
   //set start cordinat on canvas for path.
   if(phone){
    context.moveTo(mouseEvent.clientX, mouseEvent.clientY);
    brush(mouseEvent);
   }else{
    context.moveTo(event.clientX, event.clientY);
    brush(event);
   }
   //run brush one time so that if you click one time you will still have drawn a dot.
}

//draw function is called continuesly and depending on the selected tool do different stuff.
function draw(event,mouseEvent) {
    if (is_drawing) {
        if (selectedTool === 1){
            brush(event,mouseEvent);
        }else if (selectedTool === 2){
        
        }
    
    }
}

//brush is one of the selected tools. And can draw.
function brush(event,mouseEvent){
    context.strokeStyle = draw_color;
    context.lineWidth = draw_withd;
    context.lineCap = "round";
    context.lineJoin = "round";
    if(phone){
        context.lineTo(mouseEvent.clientX, mouseEvent.clientY);
        context.stroke();
    }else{
    context.lineTo(event.clientX, event.clientY);
    context.stroke();
    }
}

//stop is the function that is called when we want to stop drawing
function stop(event){
    if (is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;

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

window.addEventListener('resize',function(){
    width = (paintProgra2m.offsetWidth - canvas.offsetWidth)-paintProgra2m.offsetWidth;
    height = (paintProgra2m.offsetHeight - canvas.offsetHeight)-canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    console.log(width,height);
    context.fillStyle = startBackground;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.putImageData(undoarray[undoindex],0,0);
});