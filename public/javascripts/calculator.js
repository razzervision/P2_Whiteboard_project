document.getElementById("display").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});

function addToResult(value) {
    document.getElementById('display').value += value; //updates for every digit clicked to 'display', which is textarea
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


let amountOfMatrices = 0;

function createDimension() {
    let rows = parseInt(document.getElementById('yMatrice').value);
    let columns = parseInt(document.getElementById('xMatrice').value);

    let matricesContainer = document.querySelector('.matricesContainer');
    let newMatriceContainer = document.createElement('div');
    newMatriceContainer.classList.add(`matrice${amountOfMatrices}`);
    matricesContainer.appendChild(newMatriceContainer);

    let container = document.querySelector(`.matrice${amountOfMatrices}`);

    let matriceValues = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let input = document.createElement('input');
            input.type = 'text';
            input.id = `rc${y}${x}_${amountOfMatrices}`;
            matriceValues.id = `matrice${amountOfMatrices}`
            input.classList.add('matriceInput');
            container.appendChild(input);

            
            matriceValues.push(input.id);
        }
        container.appendChild(document.createElement('br'));
    }

    console.log(matriceValues.id, matriceValues);

    let newOperatorContainer = document.createElement('div');
    newOperatorContainer.classList.add(`matriceOperator${amountOfMatrices}`);
    matricesContainer.appendChild(newOperatorContainer);

    let selectElement = document.querySelector('.matriceOperator').cloneNode(true);
    selectElement.style.display = 'block';
    selectElement.classList.add(`matriceOperator${amountOfMatrices}`);
    document.querySelector(`.matriceOperator${amountOfMatrices}`).appendChild(selectElement);

    amountOfMatrices++;

    
}

function calcMatrice() {
    let matrices = [];

    for (let i = 0; i < amountOfMatrices; i++) {
        let matrix = [];
        for (let y = 0; y < rows; y++) {
            let row = [];
            for (let x = 0; x < columns; x++) {
                let inputValue = parseInt(document.getElementById(`rc${y}${x}_${i}`).value) || 0;
                row.push(inputValue);
            }
            matrix.push(row);
        }
        matrices.push(matrix);
    }

    let sumMatrix = [];
    let minusMatrix = [];
    let selectedOp = document.querySelector('.matriceOp').value;

    for (let y = 0; y < rows; y++) {
        let sumRow = [];
        let minusRow = [];
        for (let x = 0; x < columns; x++) {
            let sum = 0;
            let minus = 0;
            for (let i = 0; i < amountOfMatrices; i++) {
                sum += matrices[i][y][x];
                minus -= matrices[i][y][x];
            }
            sumRow.push(sum);
            minusRow.push(minus);
        }
        sumMatrix.push(sumRow);
        minusMatrix.push(minusRow);
    }

    console.log(sumMatrix);
    console.log(minusMatrix);

    // Print the result matrices based on the selected operation
    if (selectedOp === "plus") {
        printResultMatrix(sumMatrix, 'resultContainer', rows, columns);
    } else if (selectedOp === "minus") {
        printResultMatrix(minusMatrix, 'resultContainer', rows, columns);
    }
}


// Determine the selected operation
if (selectedOp === "plus" && selectedOp === "none") {
    printResultMatrix(sumMatrix, 'resultContainer', rows, columns);
} else if (selectedOp === "minus" && selectedOp === "none") {
    printResultMatrix(minusMatrix, 'resultContainer', rows, columns);
}



function restartDimension() {
    let matricesContainer = document.querySelector('.matricesContainer');
    matricesContainer.innerHTML = '';
    amountOfMatrices = 0;
}