const canvas = document.getElementById("canvas");
const clear = document.querySelector("#clearCanvas");
const undoB = document.querySelector("#undoB");
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
let undoarray = [];
let undoindex = -1;
const serverurl = document.location.origin;
const socket = io(serverurl);

const mouse = {
    x: 0,
    y: 0
};

clear.addEventListener("click", clearCanvas);
undoB.addEventListener("click", undo);

uploadInput.addEventListener("change", uploadePicture)


function uploadePicture(event){
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
  };
  function draw() {
    var canvas = document.getElementById('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0,0);
  }
  function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
  
};





canvas.addEventListener("pointerdown", pointerDown)



function pointerDown(event){
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