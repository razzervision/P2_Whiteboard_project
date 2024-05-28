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

async function fetchPostPauseData(link,postData) {
    try {
        // Send the data to the server-side script
        const response = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching pause data:", error);
        return null; // Return null or handle the error as needed
    }
}

async function recursiveClicks(){
    const session = localStorage.getItem("sessionName");
    if(!session){
        return;
    }
    const data = {
        session: session,
        websiteActivity:(mouseClicks + keyStrokes),
        averageTimeLeftWebsite: leftPageTimeAverage
    };
    await fetchPostPauseData("/api/InsertPauseData",data);  


    const checkData = {session: session};
    const doPause = await fetchPostPauseData("/api/checkForPause",checkData);
    
    if(!doPause){
        doPauseFunction();
        Window.socket.emit("doPause");
    }
    window.socket.no("doPause" , () => {
        doPauseFunction();
    }

    mouseClicks = 0;
    leftPageTimeAverage = 0;
    keyStrokes = 0;
    setTimeout(() => {
        recursiveClicks();
    }, 1 * 60 * 1000);

}
funciton doPauseFunction(){
    alert("Hold en pause");
}


function timeAwayFromPage(){
    window.addEventListener("blur", () => {
        leavingTime = Date.now(); 

    });
    window.addEventListener("focus", () => {
        
        const currentTime = Date.now();

        leftPageTime = currentTime - leavingTime; 
        leftPageTimeAverage = calcAverageActivity(leftPageTime, leftPageTimeAverage);
    });
}

const IsInSession = document.getElementById("connectSocket");
IsInSession.addEventListener("change",startLogging);

async function startLogging(){
    if(!IsInSession.checked){
        localStorage.setItem("sessionName",null);
        return;
    }
    const sessionName = "TEST";
    localStorage.setItem("sessionName",sessionName);
    const sessionNameJSON = {session: sessionName};
    const sessionExist = await fetchPostPauseData("/api/pauseSessionExist",sessionNameJSON);
    if(sessionExist){
        console.log("session already created:",sessionExist);
    } else {
        const startSession = await fetchPostPauseData("/api/StartPauseSession",sessionNameJSON);
        console.log(startSession);
    }
    clickTracker();
    recursiveClicks();
    timeAwayFromPage();
}