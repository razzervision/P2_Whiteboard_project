document.getElementById("display").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});


function addToResult(value) {
    let display = document.getElementById("display");
    display.value += value;

    if (value === "log()") {
        display.focus();
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
    let expression = document.getElementById("display").value;
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

    if(check && expression != ""){
        let result = eval(expression); //eval function calculates with js calculator. ie. Math.pow(5,1) & 52
        append(expression, result);
    }
}

function clearHistory() {
    document.getElementById("classHistory").value = ""; //function used to clear history textarea with ---> '' <--- which is nothing 
    document.getElementById("display").value ="";
}
/*
function powerOf(expression) {
    let powerIndex = expression.indexOf("^");
    if (powerIndex !== -1) {
        let base = parseInt(expression.slice(0, powerIndex));
        let exponent = parseInt(expression.slice(powerIndex + 1)); 
        let result = Math.pow(base, exponent);
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
    let extract = x.match(/\((\d+)\)/);
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
        document.querySelector(".matriceMenu").style.display = "block";
        document.querySelector(".calculator").style.display = "none";
        document.querySelector(".matrices").style.display = "block";
    }
});

let amountOfMatrices = 0;

function createDimension() {
    let columns = parseInt(document.getElementById("yMatrice").value);
    let rows = parseInt(document.getElementById("xMatrice").value); 

    if (columns === 0 || rows === 0 || isNaN(columns) || isNaN(rows)) {
        error(3);
        return;
    }    

    if(amountOfMatrices > 1){
        error(2);
        return;
    }

    if (columns > 10 || rows > 10){
        error(0); 
        return;
    }

    let matricesContainer = document.querySelector(".matricesContainer");
    let newMatriceContainer = document.createElement("div");
    newMatriceContainer.className = `matrice${amountOfMatrices}`;

    matricesContainer.appendChild(newMatriceContainer);

    let container = document.querySelector(`.matrice${amountOfMatrices}`);

    let matriceValues = [];

    for (let y = 0; y < rows; y++) { 
        for (let x = 0; x < columns; x++) { 
            let input = document.createElement("input");
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

    console.log(amountOfMatrices);
    
    amountOfMatrices++;

}


function calcMatrice() {
    let matrices = [];
    let columns = parseInt(document.getElementById("yMatrice").value); // Rows as columns
    let rows = parseInt(document.getElementById("xMatrice").value); // Columns as rows

    for (let i = 0; i < amountOfMatrices; i++) {
        let matrix = [];
        for (let y = 0; y < rows; y++) { // Columns as rows
            let row = [];
            for (let x = 0; x < columns; x++) { // Rows as columns
                let inputValue = parseInt(document.getElementById(`rc${y}${x}_${i}`).value) || 0;
                row.push(inputValue);
            }
            matrix.push(row);
        }
        matrices.push(matrix);
    }

    let operator = document.querySelector(".matriceOp").value;

    if (operator === "plus") {
        sumMatrices(matrices, rows, columns);
    } else if (operator === "minus") {
       
    } 
}

function sumMatrices(matrices, rows, columns) {
    let sumMatrix = [];
    let resultContainer = document.createElement("div");
    resultContainer.className = "resultContainer";
    
    for (let y = 0; y < rows; y++) {
        let sumRow = [];
        for (let x = 0; x < columns; x++) {
            let sum = 0;
            for (let i = 0; i < matrices.length; i++) {
                sum += matrices[i][y][x];
            }
            sumRow.push(sum);
            
            let resultInput = document.createElement("input");
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
    let minusMatrix = [];
    let resultContainer = document.createElement("div");
    resultContainer.className = "resultContainer";
    // Clear previous results
    document.querySelector('.matriceResult').innerHTML = "";

    for (let y = 0; y < rows; y++) {
        let minusRows = [];
        for (let x = 0; x < columns; x++) {
            let result = matrices[0][y][x]; // Start with the first matrix
            for (let i = 1; i < matrices.length; i++) {
                result -= matrices[i][y][x]; // Subtract subsequent matrices
            }
            minusRows.push(result);
            let resultInput = document.createElement("input");
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
    document.querySelector(".matricesContainer").innerHTML ="";
    let resetContainer = document.querySelector(".resultContainer");
    if (resetContainer){
    resetContainer.innerHTML = "";
    }
    amountOfMatrices = 0;
    console.log(amountOfMatrices);
}

function error(errorNumber){
    switch (errorNumber) {
        case 0:
            document.getElementById("errorMessage0").style.display = "block";
            document.getElementById("errorOK").style.display = "block";
            amountOfMatrices = 0;
            break;
        case 1:
            document.getElementById("errorMessage1").style.display = "block";
            document.getElementById("errorOK").style.display = "block";
            break;
        case 2:
            document.getElementById("errorMessage2").style.display = "block";
            document.getElementById("errorOK").style.display = "block";
            break;
        case 3:
            document.getElementById("errorMessage3").style.display = "block";
            document.getElementById("errorOK").style.display = "block";
            amountOfMatrices = 0;
            break;
        default:
            break;
    }
}

function agreeError(){
    let amountErrorMessages = 3;
    for (let i = 0; i < amountErrorMessages; i++) {
        //let givenError = document.getElementById(`errorMessage${i}`)
        if (document.getElementById(`errorMessage${i}`).style.display === "block"){
            document.getElementById(`errorMessage${i}`).style.display = "none";
        }
    }
    document.getElementById("errorOK").style.display = "none";
    
    let errorContainer = document.querySelector(".errorMessageDiv");
    errorContainer.innerHTML = "";
    document.querySelector(".matricesContainer").innerHTML ="";
    amountOfMatrices = 0;


}