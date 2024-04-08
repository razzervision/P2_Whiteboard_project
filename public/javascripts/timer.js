

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


const hrs = document.getElementById("hrs");
const min = document.getElementById("min");
const sec = document.getElementById("sec");
const stickymodal = document.getElementsByClassName("stickymodal");
const stickyclock = document.getElementsByClassName("stickyclock");

let workload = {hrs:"", min:"", sec:""}; 
const breaktime = {hrs:"", min:"", sec:""};
setInterval(worktimeleft, 1000);

function timer() {
    modal.style.display = "none";
    stickymodal.style.display = "none";
    stickyclock.style.display = "block";
    workload = document.getElementsByClassName("timer"); 
    // function worktimeleft(workload){
    //stickymodal.getElementsByClassName("timer").innerHTML.
    //}
}

//When the user clicks the options, the sticky's content should be replaced//

const btn2 = document.getElementsByClassName("timer")[0];

btn2.onclick = function() {
    console.log("clicked");
};
