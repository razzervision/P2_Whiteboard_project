document.getElementById("display").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});

function addToResult(value) {
    const display = document.getElementById("display");
    display.value += value;

    // Check if the value being added is "log()"
    if (value === "log()") {
        // Set focus on the display textarea
        display.focus();
        // Set the selection range between the parentheses
        display.setSelectionRange(display.value.length - 1, display.value.length - 1);
    }
}

function append(expression, result){
    document.getElementById("display").value = result; //updates display with result
    document.getElementById("classHistory").value += expression + "\n= " + result + "\n"; //creates newline after calculation
}

function clearDisplay() {
    document.getElementById("display").value = ""; //function used to clear calculator display with ---> '' <--- which is nothing 
}

function calculate() {
    const expression = document.getElementById("display").value;
    let check = true;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == "!") {
            const facResult = fac(expression);
            append(expression, facResult);
            check = false;
        } else if (expression[i] == "^"){
            const powResult = powerOf(expression);
            append(expression, powResult);
            check = false;
        } else if (expression[i] == "l" && expression[i+1] == "o"){
            
            const logResult = logarithm2(expression);
            append(expression, logResult);
            check = false;
        }
    }

    if(check){
        const result = eval(expression); //eval function calculates with js calculator. ie. Math.pow(5,1) & 52
        append(expression, result);
    }
}

function clearHistory() {
    document.getElementById("classHistory").value = ""; //function used to clear history textarea with ---> '' <--- which is nothing 
    document.getElementById("display").value ="";
}
/*
function powerOf(expression) {
    const powerIndex = expression.indexOf("^");
    console.log(powerIndex);
    if (powerIndex !== -1) {
        const base = parseInt(expression.slice(0, powerIndex));
        const exponent = parseInt(expression.slice(powerIndex + 1)); 
        const result = Math.pow(base, exponent);
        return result;
    }
}
*/
function powerOf(expression) {
    const powerIndices = [];
    let result = 0;
    
    // Collect all indices of the "^" character
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === "^") {
            powerIndices.push(i);
        }
    }
    
    // Evaluate the expression from right to left
    if (powerIndices.length > 0) {
        const lastIndex = powerIndices.length - 1;
        let base = parseInt(expression.slice(0, powerIndices[0]));
        let exponent = parseInt(expression.slice(powerIndices[0] + 1, powerIndices[1] || expression.length));
        result = Math.pow(base, exponent);
        
        for (let i = 1; i <= lastIndex; i++) {
            base = result;
            exponent = parseInt(expression.slice(powerIndices[i] + 1, powerIndices[i + 1] || expression.length));
            result = Math.pow(base, exponent);
        }
    } else {
        result = parseInt(expression);
    }
    
    return result;
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
    const extract = x.match(/\((\d+)\)/);
    console.log(extract);
    const number = parseInt(extract[1]); // Extracted number from the first capturing group
    const result = Math.log(number) / Math.log(2);
    return result; 
}

//////////////////////////////////////////////////// linear algebra

document.getElementById("mathType").addEventListener("change", function() {
    const selectedOption = this.value;
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
    const columns = parseInt(document.getElementById("yMatrice").value);
    const rows = parseInt(document.getElementById("xMatrice").value); 

    if(amountOfMatrices > 1){
        console.log("Only 2 matrices");
        return;
    }

    if (columns > 10 || rows > 10){
        resultContainer.appendChild(document.createElement(""));
        return;
    }

    const matricesContainer = document.querySelector(".matricesContainer");
    const newMatriceContainer = document.createElement("div");
    newMatriceContainer.className = `matrice${amountOfMatrices}`;

    matricesContainer.appendChild(newMatriceContainer);

    const container = document.querySelector(`.matrice${amountOfMatrices}`);

    const matriceValues = [];

    for (let y = 0; y < rows; y++) { 
        for (let x = 0; x < columns; x++) { 
            const input = document.createElement("input");
            input.type = "text";
            input.id = `rc${y}${x}_${amountOfMatrices}`;
            matriceValues.id = `matrice${amountOfMatrices}`;
            input.className = "matriceInput";
            container.appendChild(input);
            matriceValues.push(input.id);
        }
        container.appendChild(document.createElement("br"));
    }
    container.appendChild(document.createElement("br"));
    amountOfMatrices++;
}


function calcMatrice() {
    const matrices = [];
    const columns = parseInt(document.getElementById("yMatrice").value); // Rows as columns
    const rows = parseInt(document.getElementById("xMatrice").value); // Columns as rows

    for (let i = 0; i < amountOfMatrices; i++) {
        const matrix = [];
        for (let y = 0; y < rows; y++) { // Columns as rows
            const row = [];
            for (let x = 0; x < columns; x++) { // Rows as columns
                const inputValue = parseInt(document.getElementById(`rc${y}${x}_${i}`).value) || 0;
                row.push(inputValue);
            }
            matrix.push(row);
        }
        matrices.push(matrix);
    }

    const operator = document.querySelector(".matriceOp").value;

    if (operator === "plus") {
        sumMatrices(matrices, rows, columns);
    } else if (operator === "minus") {
       
    }
}

function sumMatrices(matrices, rows, columns) {
    const sumMatrix = [];
    const resultContainer = document.createElement("div");
    resultContainer.className = "resultContainer";
    
    for (let y = 0; y < rows; y++) {
        const sumRow = [];
        for (let x = 0; x < columns; x++) {
            let sum = 0;
            for (let i = 0; i < matrices.length; i++) {
                sum += matrices[i][y][x];
            }
            sumRow.push(sum);
            
            const resultInput = document.createElement("input");
            resultInput.type = "text";
            resultInput.className = "resultInput";
            resultInput.value = sum;
            resultContainer.appendChild(resultInput);
        }
        sumMatrix.push(sumRow);
        resultContainer.appendChild(document.createElement("br"));
    }
    
    document.querySelector(".matriceResult").appendChild(resultContainer);

    return sumMatrix;
}

/*
function minusMatrices(matrices, rows, columns) {
    const minusMatrix = [];
    const resultContainer = document.createElement("div");
    resultContainer.className = "resultContainer";
    // Clear previous results
    document.querySelector('.matriceResult').innerHTML = "";

    for (let y = 0; y < rows; y++) {
        const minusRows = [];
        for (let x = 0; x < columns; x++) {
            let result = matrices[0][y][x]; // Start with the first matrix
            for (let i = 1; i < matrices.length; i++) {
                result -= matrices[i][y][x]; // Subtract subsequent matrices
            }
            minusRows.push(result);
            const resultInput = document.createElement("input");
            resultInput.type = "text";
            resultInput.className = "resultInput";
            resultInput.value = result;
            resultContainer.appendChild(resultInput);
            
        }
        minusMatrix.push(minusRows);
        resultContainer.appendChild(document.createElement("br"));
    }
    document.querySelector(".matriceResult").appendChild(resultContainer);
    return minusMatrix;
}

*/
function restartDimension() {
    const matricesContainer = document.querySelector(".matricesContainer");
    matricesContainer.innerHTML = "";
    const resetContainer = document.querySelector(".resultContainer");
    resetContainer.innerHTML = "";
    amountOfMatrices = 0;
}