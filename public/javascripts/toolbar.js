const paintButton = document.getElementById("paint_button");
const quizButton = document.getElementById("quiz_button");
const calcButton = document.getElementById("calc_button");
const codeButton = document.getElementById("code_button");

const paintProgram = document.getElementById("paintProgram");
const codeProgram = document.getElementById("codeProgram");
const quizProgram = document.getElementById("quizProgram");
const calcProgram = document.getElementById("calcProgram");


paintButton.addEventListener("click", function() {
    if (paintProgram.style.display === "none") {
        paintProgram.style.display = "block";
    } else {
        paintProgram.style.display = "none";
    }
});

codeButton.addEventListener("click", function() {
    if (codeProgram.style.display === "none") {
        codeProgram.style.display = "block";
    } else {
        codeProgram.style.display = "none";
    }
});

quizButton.addEventListener("click", function() {
    if (quizProgram.style.display === "none") {
        quizProgram.style.display = "block";
    } else {
        quizProgram.style.display = "none";
    }
});

calcButton.addEventListener("click", function() {
    if (calcProgram.style.display === "none") {
        calcProgram.style.display = "block";
    } else {
        calcProgram.style.display = "none";
    }
});