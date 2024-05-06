// // Get the modal
// const modal = document.getElementById("myModalforPauses");
// const modal2 = document.getElementById("Modalforclockbutton"); 

// // Get the button that opens the modal
// const btn = document.getElementById("pauses"); 
// const btn2 = document.getElementById("clockbutton");

// // Get the <span> element that closes the modal
// const span = document.getElementsByClassName("close")[0]; 
// const span2 = document.getElementsByClassName("close")[1]; //Depending on the span we want to access, this array number has to match.
// //Whenever I try to let span, I can't change it in my function. I would prefer that I could set the span variable as the button is clicked. But this make do.


// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//     modal.style.display = "block";

// };

// btn2.onclick = function() {
//     modal2.style.display = "block";
// };

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// };

// // When the user clicks on <span> (x), close the modal
// span2.onclick = function() {
//     modal2.style.display = "none";
// };

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target === modal) {
//         modal.style.display = "none";
//     }
//     if (event.target === modal2) {
//         modal2.style.display = "none";
//     }
// };


// const hrs = document.getElementById("hrs");
// const min = document.getElementById("min");
// const sec = document.getElementById("sec");
// const stickymodal = document.getElementsByClassName("stickymodal");
// const stickyclock = document.getElementsByClassName("stickyclock");
// const clock = document.getElementsByClassName("clock");
// const workload = {hrs:"", min:"", sec:""}; 
// const breaktime = {hrs:"", min:"", sec:""};
// let StartingTime = 0;
// let TimerInterval = 0;
// let PauseInterval = 0;
// //const StartingTime = 1000; was used as an early test example.
// let reservedHours = 0;
// let reservedMinutes = 0;
// let reservedSeconds = 5;

// function PauseTimerArgument(h, m, s){
//     reservedHours=h;
//     reservedMinutes=m;
//     reservedSeconds=s;

//     console.log(reservedHours);
//     console.log("reservedMinutes =", reservedMinutes);
//     console.log(reservedSeconds);
// }

// function UpdateCountdownForPause(){

//     //Every time we iterate or run the function again, the amount of seconds in starting time gets reduced by 1 second. 
//     StartingTime--; 
//     console.log(StartingTime); //Test
    
//     //converting the amount of seconds in starting time to hrs, min, sec, representation. Then putting them into the appropriate HTML elements. 
//     sec.innerHTML = (StartingTime % 60);
//     min.innerHTML = Math.floor((StartingTime - (Math.floor(StartingTime / 3600) * 3600)) / 60);
//     hrs.innerHTML = Math.floor(StartingTime / 3600); 
    
    
//     if (StartingTime === 0){
//         clearInterval(PauseInterval);
//         modal.style.display = "block";
//         for (item of stickymodal){
//             item.style.display = "block";
//         }
//         for (item of stickyclock){
//             item.style.display = "none";
//         }
//         for (item of clock){
//             item.style.display = "none";
//         }
//     }

// }


// function timer(h, m, s) {
//     //Hides the original modal
//     modal.style.display = "none";
//     for (item of stickymodal){
//         item.style.display = "none";
//     }
//     //Visualises the hidden stickyclock sticky
//     for (item of stickyclock){
//         item.style.display = "block";
//     }
//     //visualises the clock which gets added to the now visible sticky
//     for (item of clock){
//         item.style.display = "block";
//     }
    
//     //We set our innerHTML elements to be equal to given parameters: Hours, minutes, seconds.
//     hrs.innerHTML = h;
//     min.innerHTML = m;
//     sec.innerHTML = s; 
    
//     //We take our workload object, which is hrs, min, sec, and set them equal to our parameters as well. 
//     workload.hrs = h;
//     workload.min = m;
//     workload.sec = s;
//     //Starting time is the amount of seconds there is in an hour, minutes, and seconds. 
//     StartingTime = workload.hrs*60*60 + workload.min*60 + workload.sec;
//     TimerInterval = setInterval(UpdateCountdown, 1000); //We then make the update countdown function run every second. 
//     UpdateCountdown(); //We also run the function once to make sure it starts at the right time.
    
// }

// function UpdateCountdown(){
        
//     //Every time we iterate or run the function again, the amount of seconds in starting time gets reduced by 1 second. 
//     StartingTime--; 
//     console.log(StartingTime); //Test
        
//     //converting the amount of seconds in starting time to hrs, min, sec, representation. Then putting them into the appropriate HTML elements. 
//     sec.innerHTML = (StartingTime % 60);
//     min.innerHTML = Math.floor((StartingTime - (Math.floor(StartingTime / 3600) * 3600)) / 60);
//     hrs.innerHTML = Math.floor(StartingTime / 3600); 
        
//     //Here I intend on terminating the function and call a new one called "pause" which will have its own parameters. 
//     //From what I can gather, I can use a return statement, since I can't figure out if this is a loop
//     //Or just a function being called every second. I need to be able to check if the innerHTML is all equal to 0 that I can make it do something else.
//     if (StartingTime === 0){
//         clearInterval(TimerInterval);

//         PauseTimer(reservedHours, reservedMinutes, reservedSeconds);
//         alert("Break time");

//     }
// }


// //The pause function should be very similar to the timer function.
// function PauseTimer(h2, m2, s2) {

//     console.log("Hello World"); //Test to see that the function gets called.
    
//     hrs.innerHTML = h2;
//     min.innerHTML = m2;
//     sec.innerHTML = s2; 
    
//     breaktime.hrs = h2;
//     breaktime.min = m2;
//     breaktime.sec = s2;

//     StartingTime = breaktime.hrs*60*60 + breaktime.min*60 + breaktime.sec;
//     PauseInterval = setInterval(UpdateCountdownForPause, 1000);
//     UpdateCountdownForPause();

// }

// function ClaireDeLune(h, m, s){
    
    
//     PauseTimer(h, m, s);
   
    
// }

let leavePageCounter = 0;
let reconPageCounter = 0;
let mouseClicks = 0;
let leavingTime; 
let leftPageTime;
let leftPageTimeAverage = 0;
let keyStrokes = 0;


function calcAverageActivity(leftPageTime, leftPageTimeOld) {
    if (leftPageTimeOld === 0) {
        return leftPageTime;
    } 
    return (leftPageTimeOld + leftPageTime)/2;
    
}

function clickTracker(){

    document.addEventListener("keydown", () => {
        keyStrokes++;

    }); 

    document.addEventListener("click", () => {
        mouseClicks++;
    });
}


function recursiveClicks(){
    const counterResult = leavePageCounter === reconPageCounter ? leavePageCounter : (leavePageCounter - 1);
    const data = {
        pageActivity:(mouseClicks + keyStrokes),
        leavePageCounter: counterResult,
        averageLeftPageTime: leftPageTimeAverage
    };

    console.log(data);
    

    leavePageCounter = leavePageCounter === reconPageCounter ? 0 : 1;

 
    reconPageCounter = 0;
    mouseClicks = 0;
    leftPageTimeAverage = 0;
    keyStrokes = 0;
    setTimeout(() => {
        console.log("Big dick Rasmus");
        recursiveClicks();
    }, 60000);
}


function timeAwayFromPage(){
    window.addEventListener("blur", () => {
        leavePageCounter++;
        leavingTime = Date.now(); 

    });
    window.addEventListener("focus", () => {
    
    
        if (leavePageCounter === 0) {
            return 0;
        }
        const currentTime = Date.now();

        leftPageTime = currentTime - leavingTime; 
        console.log(leftPageTime, leftPageTimeAverage);
        leftPageTimeAverage = calcAverageActivity(leftPageTime, leftPageTimeAverage);

        console.log(leftPageTimeAverage);
        reconPageCounter++;
    });
}


startLogging();

function startLogging(){
    clickTracker();
    recursiveClicks();
    timeAwayFromPage();

}

// const data = {
//     pageActivity:(mouseClicks + keyStrokes),
//     leavePageCounter: counterResult,
//     averageLeftPageTime: leftPageTimeAverage
// };

// let timeSinceLastBreak = 0;
// let breakTime = 0;

// function calculatePause({pageActivity, leavePageCounter, leftPageTimeAverage}){
//     if(pageActivity <= 50 || leftPageTimeAverage >= 45000){
//         return breakTime = timeSinceLastBreak / 3;
//     }
//     if(timeSinceLastBreak === 3.6e+6){
//         return breakTime = timeSinceLastBreak / 3;
//     }
// }

//OBS pageActivity skal være mindre eller lig 300 over 5 intervaller, intervallerne skal være 1 minut