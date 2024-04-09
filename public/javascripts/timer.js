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
const clock = document.getElementsByClassName("clock");
const workload = {hrs:"", min:"", sec:""}; 
const breaktime = {hrs:"", min:"", sec:""};
const StartingTime = 1000;
//setInterval(worktimeleft, 1000);

function timer(h, m, s) {
    modal.style.display = "none";
    for (item of stickymodal){
        item.style.display = "none";
    }
    for (item of stickyclock){
        item.style.display = "block";
    }
    for (item of clock){
        item.style.display = "block";
    }
    

    hrs.innerHTML = h;
    min.innerHTML = m;
    sec.innerHTML = s; 
    
    workload.hrs = h;
    workload.min = m;
    workload.sec = s;

    let StartingTime = workload.hrs*60*60 + workload.min*60 + workload.sec;
    setInterval(UpdateCountdown, 1000);

    function UpdateCountdown(){
        
    
        StartingTime--;

        console.log(StartingTime); 
        
        sec.innerHTML = (StartingTime % 60);
        min.innerHTML = Math.floor((StartingTime - (Math.floor(StartingTime / 3600) * 3600)) / 60);
        hrs.innerHTML = Math.floor(StartingTime / 3600); 

    }
    // function worktimeleft(workload){
    //stickymodal.getElementsByClassName("timer").innerHTML.
    //}
}

//When the user clicks the options, the sticky's content should be replaced//

const btn2 = document.getElementsByClassName("timer")[0];

