

// Get the modal
const modal = document.getElementById("myModalforPauses");

// Get the button that opens the modal
const btn = document.getElementById("pauses");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


let hrs = document.getElementById("hrs");
let min = document.getElementById("min");
let sec = document.getElementById("sec");

let workload = {hrs"":, min"":, sec"":}; 
let breaktime = {hrs"", min"", sec"";};

function timer() {
    workload = document.getElementsByClassName("timer");
}

//When the user clicks the options, the sticky's content should be replaced//

const btn2 = document.getElementsByClassName("timer");

btn2.onclick = function() {
    sticky.style.
}