function generateRoomCode() {
    let roomCode = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 12; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomCode;
}


document.getElementById("create-room").addEventListener("click", function() {
    const roomCode = "/togetherPaint/" + generateRoomCode();
    
    window.location.href = roomCode;
});