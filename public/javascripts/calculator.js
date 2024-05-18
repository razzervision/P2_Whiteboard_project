/**
 * Listens for the "Enter" key press event and triggers the calculation function.
 */
document.getElementById("display").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});


/**
 * Appends a single number, character, or expression to the display on the calculator.
 *
 * @param {char|string|number} value - The value to append to the display. It can be a single character, string, or number representing a number or expression.
 * @description If the value is "log()", it sets the focus and selection range to the last character of the display.
 */
function addToResult(value) {
    let display = document.getElementById("display");
    display.value += value;

    if (value === "log()") {
        display.focus();
        display.setSelectionRange(display.value.length - 1, display.value.length - 1);
    }
}


/**
 * Appends expression and result string to history textarea.
 *
 * @param {string} expression - appends the mathematical expression to a textarea
 * @param {string} result - appends the result to the same textarea on a newline
 */
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
        let result = eval(expression);
        append(expression, result);
    }
}

function clearHistory() {
    document.getElementById("classHistory").value = ""; //function used to clear history textarea with ---> '' <--- which is nothing 
    document.getElementById("display").value ="";
}

/**
 * Computes the result of a mathematical expression involving exponentiation.
 *
 * @param {string} expression - The mathematical expression to evaluate. It may contain one or more instances of the "^" character indicating exponentiation.
 * @returns {number} The result of evaluating the expression.
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

/**
 * Calculates the logarithm of a given number
 *
 * @param {string} num - the string [number + !] of which the user wants to find the factorial result of
 * @returns {number} - the result is returned 
 */
function fac(num) {
    let result = 1;
    num = parseInt(num);
    for (let i = 1; i <= num; i++) {
        result *= i;
    }
    return result;
}
/**
 * Calculates the logarithm of a given number
 *
 * @param {string} x - the string [log(x)] of which the user wants to find the logarithm of
 * @returns {number} - the result is returned as a float
 */
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

/**
 * Creates a matrix with the specified dimensions and input fields.
 */
function createDimension() {
    // Get the number of columns and rows from user input
    let columns = parseInt(document.getElementById("yMatrice").value);
    let rows = parseInt(document.getElementById("xMatrice").value);

    // Validate user input
    if (columns === 0 || rows === 0 || isNaN(columns) || isNaN(rows)) {
        error(3);
        return;
    }

    if (amountOfMatrices > 1) {
        error(2);
        return;
    }

    if (columns > 10 || rows > 10) {
        error(0);
        return;
    }

    // Create variable to the container for matrices
    let matricesContainer = document.querySelector(".matricesContainer");

    // Create a new container for the current matrix
    let newMatriceContainer = document.createElement("div");
    newMatriceContainer.className = `matrice${amountOfMatrices}`;
    matricesContainer.appendChild(newMatriceContainer);

    // Get the newly created container
    let container = document.querySelector(`.matrice${amountOfMatrices}`);

    // Create input fields for the matrix
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let input = document.createElement("input");
            input.type = "text";
            input.id = `rc${y}${x}_${amountOfMatrices}`;
            input.className = "matriceInput";
            container.appendChild(input);
        }
        container.appendChild(document.createElement("br"));
    }

    // Add extra space between matrices
    container.appendChild(document.createElement("br"));

    // Increment the matrix count
    amountOfMatrices++;
}


/**
 * Calculates the result of the matrix operation based on the selected operator.
 */
function calcMatrice() {
    let matrices = [];
    let columns = parseInt(document.getElementById("yMatrice").value); 
    let rows = parseInt(document.getElementById("xMatrice").value); 

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

    let operator = document.querySelector(".matriceOp").value;

    if (operator === "plus") {
        sumMatrices(matrices, rows, columns);
    } else if (operator === "minus") {
        subtractMatrices(matrices, rows, columns)
    } 
}

/**
 * Computes the sum of multiple matrices.
 *
 * @param {number[][][]} matrices - An array of matrices to be summed. Each matrice is two dimensional.
 * @param {number} rows - The number of rows in each matrix.
 * @param {number} columns - The number of columns in each matrix.
 * @returns {number[][]} The resulting matrix after summing all input matrices.
 */

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



/**
 * Computes the subtraction of multiple matrices.
 *
 * @param {number[][][]} matrices - An array of matrices to be summed. Each matrice is two dimensional.
 * @param {number} rows - The amount of rows in each matrix.
 * @param {number} columns - The amount of columns in each matrix.
 * @returns {number[][]} The resulting matrix after summing all input matrices.
 */
function subtractMatrices(matrices, rows, columns) {
    let resultMatrix = [];
    let resultContainer = document.createElement("div");
    resultContainer.className = "resultContainer";
    
    for (let y = 0; y < rows; y++) {
        let resultRow = [];
        for (let x = 0; x < columns; x++) {
            let difference = matrices[0][y][x]; // Initialize with the first matrix
            for (let i = 1; i < matrices.length; i++) { // Start from the second matrix
                difference -= matrices[i][y][x];
            }
            resultRow.push(difference);
            
            let resultInput = document.createElement("input");
            resultInput.type = "text";
            resultInput.className = "resultInput";
            resultInput.value = difference;
            resultContainer.appendChild(resultInput);
        }
        resultMatrix.push(resultRow);
        resultContainer.appendChild(document.createElement("br"));
    }
    
    document.querySelector(".matriceResult").appendChild(resultContainer);

    return resultMatrix;

}

function restartDimension() {
    document.querySelector(".matricesContainer").innerHTML ="";
    let resetContainer = document.querySelector(".resultContainer");
    if (resetContainer){
    resetContainer.innerHTML = "";
    }
    amountOfMatrices = 0;
    
    console.log(amountOfMatrices);
}


function containsNumber170PlusFactorial(input) {
    // Regular expression to match digits before "!" until it reaches a non-digit character
    const regex = /[0-9]+(?=!)/;
    const match = input.match(regex);
    if (match) {
        const number = parseInt(match[0]);
        return number >= 170;
    }
    return false;
}


/**
 * Displays an error message based on the provided error number.
 *
 * @param {number} errorNumber - A manually defined number representing a given error.
 */
function error(errorNumber) {
    switch (errorNumber) {
        case 0:
            document.getElementById("errorMessage0").style.display = "block";
            amountOfMatrices = 0;
            break;
        case 1:
            document.getElementById("errorMessage1").style.display = "block";
            break;
        case 2:
            document.getElementById("errorMessage2").style.display = "block";
            break;
        case 3:
            document.getElementById("errorMessage3").style.display = "block";
            amountOfMatrices = 0;
            break;
        default:
            break;
    }
}