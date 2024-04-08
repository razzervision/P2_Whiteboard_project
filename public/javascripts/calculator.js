

//add single digits to textarea function
function addToResult(value) {
    document.getElementById('display').value += value;
    document.getElementById('classHistory').value += value;
}


function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    let expression = document.getElementById('display').value;
    let result = eval(expression);
    document.getElementById('display').value = result; 


}

//history

function clearHistory() {
    document.getElementById('classHistory').value = '';
}


function addHistory(value) {
    document.getElementById('classHistory').value += value;
}

function submitCalculation() {
    calculate(); // Assuming you have a calculate function defined elsewhere
    addHistory();
}







let str = "10^2";
let i = 0;
let left_str = "";
let right_str = "";

Array.from(str).forEach(elem => {
    if (i == 0) {
        if (elem == "^") {
            i = 1;
        } else {
            left_str = left_str.concat(elem);
        }
    } else {
        right_str = right_str.concat(elem);
    }
});

parseInt(left_str);
parseInt(right_str);

calc(left_str, right_str);

function calc (l, r) {
    console.log(Math.pow(l, r));
}