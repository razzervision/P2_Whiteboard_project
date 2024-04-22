

function addToResult(value) {
    document.getElementById('display').value += value; //updates for every digit clicked to 'display', which is textarea
}

function clearDisplay() {
    document.getElementById('display').value = ''; //function used to clear history textinput with ---> '' <--- which is nothing 
}

function calculate() {
    let expression = document.getElementById('display').value;

    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == "!"){
            factorial(expression);
        }
        if (expression[i] == "^"){

        }
    }

    let result = eval(expression); //eval function calculates with js calculator. ie. Math.pow(5,1) & 5*2
    document.getElementById('display').value = result; //updates display with result
    document.getElementById('classHistory').value += expression + '\n= ' + result + '\n';  //creates newline after calculation
    document.getElementById('classHistory').value += value

}

function clearHistory() {
    document.getElementById('classHistory').value = ''; //function used to clear history textarea with ---> '' <--- which is nothing 
}

function negative(value) {

    if (document.getElementById('display').value[0] != "-") {
        document.getElementById('display').value = "-" + document.getElementById('display').value;
    } 
    if (document.getElementById('display').value[0] == "-"){
        document.getElementById('display').value = "" + document.getElementById('display').value;        
    }

}

function power(expression) {
    let num = parseInt(expression);
    let result = 1;

}


function factorial(expression) {
    let num = parseInt(expression); // Convert expression to integer
    let result = 1;
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    document.getElementById('display').value = result; // Update display with factorial result
    document.getElementById('classHistory').value += expression + '\n= ' + result + '\n';  //creates newline after calculation
    document.getElementById('classHistory').value += value
}




/*

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

 */