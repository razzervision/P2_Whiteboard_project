
const checkbox = document.getElementById("connectSocket");
const managerUrl = document.location.origin;
const socketManager = io(managerUrl, {autoConnect: false});

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        socketManager.connect();
        console.log("connected");
    } else {
        socketManager.disconnect();
        console.log("disconnected");
    }
});

window.socket = socketManager; // Expose the socketManager to the window object