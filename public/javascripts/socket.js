(function() {
    const checkbox = document.getElementById("connectSocket");
    const serverurl = document.location.origin;
    const socket = io(serverurl, { autoConnect: false });

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            socket.connect();
            console.log("connected");
            localStorage.setItem("sessionName","TEST");
        } else {
            socket.disconnect();
            console.log("disconnected");
            localStorage.setItem("sessionName",null);
        }
    });
})();

