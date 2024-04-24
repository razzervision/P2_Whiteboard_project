// Get the modal
const modal = document.getElementById("myModalforPauses");
const modal2 = document.getElementById("Modalforclockbutton"); 

// Get the button that opens the modal
const btn = document.getElementById("pauses"); 
const btn2 = document.getElementById("clockbutton");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0]; 
const span2 = document.getElementsByClassName("close")[1]; //Depending on the span we want to access, this array number has to match.
//Whenever I try to let span, I can't change it in my function. I would prefer that I could set the span variable as the button is clicked. But this make do.

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";

};

btn2.onclick = function() {
    modal2.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === modal2) {
        modal2.style.display = "none";
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
//const StartingTime = 1000; was used as an early test example.

function PauseTimerArgument(h, m, s){
    PauseTimer(h, m, s);
}

function timer(h, m, s) {
    //Hides the original modal
    modal.style.display = "none";
    for (item of stickymodal){
        item.style.display = "none";
    }
    //Visualises the hidden stickyclock sticky
    for (item of stickyclock){
        item.style.display = "block";
    }
    //visualises the clock which gets added to the now visible sticky
    for (item of clock){
        item.style.display = "block";
    }
    
    //We set our innerHTML elements to be equal to given parameters: Hours, minutes, seconds.
    hrs.innerHTML = h;
    min.innerHTML = m;
    sec.innerHTML = s; 
    
    //We take our workload object, which is hrs, min, sec, and set them equal to our parameters as well. 
    workload.hrs = h;
    workload.min = m;
    workload.sec = s;
    //Starting time is the amount of seconds there is in an hour, minutes, and seconds. 
    let StartingTime = workload.hrs*60*60 + workload.min*60 + workload.sec;
    const TimerInterval = setInterval(UpdateCountdown, 1000); //We then make the update countdown function run every second. 

    function UpdateCountdown(){
        
        //Every time we iterate or run the function again, the amount of seconds in starting time gets reduced by 1 second. 
        StartingTime--; 
        console.log(StartingTime); //Test
        
        //converting the amount of seconds in starting time to hrs, min, sec, representation. Then putting them into the appropriate HTML elements. 
        sec.innerHTML = (StartingTime % 60);
        min.innerHTML = Math.floor((StartingTime - (Math.floor(StartingTime / 3600) * 3600)) / 60);
        hrs.innerHTML = Math.floor(StartingTime / 3600); 
        
        //Here I intend on terminating the function and call a new one called "pause" which will have its own parameters. 
        //From what I can gather, I can use a return statement, since I can't figure out if this is a loop
        //Or just a function being called every second. I need to be able to check if the innerHTML is all equal to 0 that I can make it do something else.
        if (StartingTime === 0){
            clearInterval(TimerInterval);
            PauseTimer(h, m, s);
            alert("Break time");

        }
    }
}

//The pause function should be very similar to the timer function.
function PauseTimer(h, m, s) {

    console.log("Hello World"); //Test to see that the function gets called.
    
    hrs.innerHTML = h;
    min.innerHTML = m;
    sec.innerHTML = s; 
    
    breaktime.hrs = h;
    breaktime.min = m;
    breaktime.sec = s;

    let StartingTime = breaktime.hrs*60*60 + breaktime.min*60 + breaktime.sec;
    const PauseInterval = setInterval(UpdateCountdown, 1000);

    function UpdateCountdown(){

        //Every time we iterate or run the function again, the amount of seconds in starting time gets reduced by 1 second. 
        StartingTime--; 
        console.log(StartingTime); //Test
        
        //converting the amount of seconds in starting time to hrs, min, sec, representation. Then putting them into the appropriate HTML elements. 
        sec.innerHTML = (StartingTime % 60);
        min.innerHTML = Math.floor((StartingTime - (Math.floor(StartingTime / 3600) * 3600)) / 60);
        hrs.innerHTML = Math.floor(StartingTime / 3600); 
        
        
        if (StartingTime === 0){
            clearInterval(PauseInterval);
            modal.style.display = "block";
            for (item of stickymodal){
                item.style.display = "block";
            }
            for (item of stickyclock){
                item.style.display = "none";
            }
            for (item of clock){
                item.style.display = "none";
            }
        }

    }

}

function ClaireDeLune(h, m, s){
    
    PauseTimer(h, m, s);
   
    
}