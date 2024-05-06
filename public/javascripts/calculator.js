function addToResult(value) {
    document.getElementById('display').value += value; //updates for every digit clicked to 'display', which is textarea
    //document.getElementById('classHistory').value += value; //updates for every digit clicked to 'classHistory', which is textarea
}

function append(expression, result){
    document.getElementById('display').value = result; //updates display with result
    document.getElementById('classHistory').value += expression + '\n= ' + result + '\n';  //creates newline after calculation
}

function clearDisplay() {
    document.getElementById('display').value = ''; //function used to clear calculator display with ---> '' <--- which is nothing 
}

function calculate() {
    let expression = document.getElementById('display').value;
    let check = true;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == "!") {
            let facResult = fac(expression);
            append(expression, facResult);
            check = false;
        }
        else if (expression[i] == "^"){
            let powResult = powerOf(expression);
            append(expression, powResult);
            check = false;
        }
    }

    if(check){
        let result = eval(expression); //eval function calculates with js calculator. ie. Math.pow(5,1) & 52
        append(expression, result);
    }
}

function clearHistory() {
    document.getElementById('classHistory').value = ''; //function used to clear history textarea with ---> '' <--- which is nothing 
}

function powerOf(expression) {
    let powerIndex = expression.indexOf('^');
    if (powerIndex !== -1) {
        let base = parseInt(expression.slice(0, powerIndex));
        let exponent = parseInt(expression.slice(powerIndex + 1)); 
        let result = Math.pow(base, exponent);
        return result;
    }
}

function fac(num) {
    let result = 1;
    num = parseInt(num);
    for (let i = 1; i <= num; i++) {
        result*= i;
    }
    return result;
}
function logarithm2(expression){
    let result = 1;
    let base = 2;
    expression = parseInt(expression);


}