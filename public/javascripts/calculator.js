document.getElementById("display").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});

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
        } else if (expression[i] == "^"){
            let powResult = powerOf(expression);
            append(expression, powResult);
            check = false;
        } else if (expression[i] == "l" && expression[i+1] == "o"){
            console.log("elsifvirker");
            let logResult = logarithm2(expression);
            append(expression, logResult);
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
        result *= i;
    }
    return result;
}
function logarithm2(x){
    console.log(x);
    let extract = x.match(/\((\d+)\)/);
    console.log(extract);
    let number = parseInt(extract[1]); // Extracted number from the first capturing group
    let result = Math.log(number) / Math.log(2);
    return result; 
}

//////////////////////////////////////////////////// linear algebra

document.getElementById("mathType").addEventListener("change", function() {
    let selectedOption = this.value;
    if (selectedOption === "calculator") {
        document.querySelector(".calculator").style.display = "block";
        document.querySelector(".matrices").style.display = "none";
    } else if (selectedOption === "matricesMath") {
        document.querySelector(".calculator").style.display = "none";
        document.querySelector(".matrices").style.display = "block";
    }
});

/*
Example of 3x3 matrice
rc_00, rc_01, rc_02,
rc_10, rc_11, rc_12,
rc_20, rc_21, rc_22

increment is before to ensure the correct calculation order
*/ 
    let incrementMatrice = 0;
function createDimension() {
    let rows = parseInt(document.getElementById('yMatrice').value);
    let columns = parseInt(document.getElementById('xMatrice').value);
    let container = document.querySelector(`.matriceCalculation${incrementMatrice}`);
    console.log(incrementMatrice);

    if (!container) {
        console.error(`Container with class "matriceCalculation${incrementMatrice}" not found.`);
        return;
    }

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let input = document.createElement('input');
            input.type = 'text';
            input.id = incrementMatrice + 'rc' + y + x;
            input.classList.add('matriceInput');
            container.appendChild(input);
        }
        container.appendChild(document.createElement('br'));
    }

    container.appendChild(document.querySelector('.matriceOp'));

    // Create a new container for the next matrix calculation
    let newContainer = document.createElement('div');
    newContainer.classList.add(`matriceCalculation${incrementMatrice + 1}`);
    document.querySelector('.matrices').appendChild(newContainer);

    
    incrementMatrice += incrementMatrice; 
    
}



function removeDimension() {
    
}

function restartDimension(){
    let container = document.getElementsByClassName('matriceCalculation')[0]; // Assuming there's only one .matrices element
    container.innerHTML = '';
}

function calculateMatrice(){

}