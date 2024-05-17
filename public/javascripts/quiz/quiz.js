//---------------------------------------------------------------------------------------Constants

//Maximum answer the user can insert. 
const maxAnswers = 5;

//socket.io
// const serverURLForSocket = document.location.origin;
// const window.socket = io(serverURLForSocket, {autoConnect: false});

//---------------------------------------------------------------------------------------Helping funktions

/**
 * Escapes special characters in a string to prevent HTML injection.
 * @param {string} unsafeString - The string to be escaped.
 * @returns {string} The escaped string.
 */
function escapeHtml(unsafeString) {
    return unsafeString.replace(/[&<>"']/g, function(match) {
        switch (match) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "'": return "&#039;";
        }
    });
}

/**
 * Decodes HTML entities back to their original characters.
 * @param {string} htmlString - The string with HTML entities to be decoded.
 * @returns {string} The decoded string.
 */
function decodeHtml(htmlString) {
    return htmlString.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(match) {
        switch (match) {
            case '&amp;': return '&';
            case '&lt;': return '<';
            case '&gt;': return '>';
            case '&quot;': return '"';
            case '&#039;': return "'";
        }
    });
}



/**
 * Checks if an HTML element with the specified ID exists in the document.
 * @param {string} id - The ID of the element to check.
 * @returns {boolean} - True if an element with the specified ID exists, otherwise false.
 */
function isIdCreated(id){
    const element = document.getElementById(id);
    if (element) {
        return true;
    } 
    return false;
}

/**
 * Displays an error message on the webpage.
 * If there is already an existing error message with the same content, it won't duplicate it.
 * The error message is automatically removed after 3 seconds.
 * @param {string} message - The error message to display.
 * @param {HTMLElement} placement - The HTML element after which the error message should be placed.
 */
function errorMessage(message,placement){
    //Check if there already is a fail message
    if(isIdCreated("error_message")){
        const oldMessage = document.getElementById("error_message");
        if(oldMessage.textContent === message){
            return;
        }
    }
    //Generate a error message for the user.
    const error = document.createElement("h4");
    error.id = "error_message";
    error.textContent = message;
    error.style.color = "red";

    //Identify the element after answer inputs. 
    placement.parentNode.appendChild(error); 

    // Remove it again after 3 seconds
    setTimeout(function() {
        error.remove();
    }, 3000);
}

/**
 * Fetches quiz data from a specified URL using the GET method.
 * @param {string} link - The URL from which to fetch the quiz data.
 * @returns {Promise<object|null>} - A promise that resolves with the quiz data if the request is successful, otherwise null.
 */
async function fetchGetQuizData(link) {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Use the data to display your quiz
        return data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null; // Return null or handle the error as needed
    }
}

/**
 * Sends JSON-formatted quiz data to a specified URL using the POST method.
 * @param {string} link - The URL to which to send the quiz data.
 * @param {object} postData - The JSON-formatted data to be sent to the server-side script.
 * @returns {Promise<object|null>} - A promise that resolves with the response data if the request is successful, otherwise null.
 */
async function fetchPostQuizData(link,postData) {
    try {
        // Send the data to the server-side script
        const response = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null; // Return null or handle the error as needed
    }
}

/**
 * Hides specified HTML div elements and displays the one provided.
 * @param {HTMLElement} show - The HTML element to display.
 */
function hideDivs(show) {
    const start = document.getElementById("quiz_index");
    const createQuizIndexDiv = document.getElementById("createQuizDiv");
    const createQuiz = document.getElementById("creat_quiz_div");
    
    const joinQuizIndexDiv = document.getElementById("joinQuizDiv");
    const searchQuizIndexDiv = document.getElementById("searchQuizDiv");

    const quizOutput = document.getElementById("quiz_output");
    const quizResult = document.getElementById("quiz_output_results");

    const newCreatedQuiz = document.getElementById("newCreatedQuiz");
    if(newCreatedQuiz){
        newCreatedQuiz.remove();
    }

    const list = [start,createQuizIndexDiv,createQuiz,joinQuizIndexDiv,searchQuizIndexDiv,quizOutput,quizResult];
    // Hide all elements first
    list.forEach(div => {
        div.style.display = "none";
    });
    show.style.display = "block";
}

/**
 * Creates an HTML element with specified attributes.
 * @param {string} type - The type of HTML element to create (e.g., 'div', 'span', 'button').
 * @param {string} id - The ID to assign to the created element.
 * @param {string} className - The class name(s) to assign to the created element.
 * @param {string} textContent - The text content to assign to the created element.
 * @returns {HTMLElement} - The created HTML element.
 */
function createAllElement(type,id,className,textContent){
    const element = document.createElement(type);
    element.id = id;
    element.className = className;
    element.textContent = textContent;
    return element;
}


//---------------------------------------------------------------------------------------Home page
//Add an event listener to create quiz, join quiz and search quiz.
const homeScreenDiv = document.getElementById("quiz_index");
const homeScreenButton = document.getElementById("quiz_home_screen");
homeScreenButton.addEventListener("click", () => {
    const start = document.getElementById("quiz_index");
    hideDivs(homeScreenDiv);
});

const createQuizIndexDiv = document.getElementById("createQuizDiv");
const createQuizIndexButton = document.getElementById("createQuizIndex");
createQuizIndexButton.addEventListener("click", () => {
    hideDivs(createQuizIndexDiv);
});

const joinQuizIndexDiv = document.getElementById("joinQuizDiv");
const joinQuizIndexButton = document.getElementById("joinQuizIndex");
joinQuizIndexButton.addEventListener("click", () => {
    hideDivs(joinQuizIndexDiv);
});

const searchQuizIndexDiv = document.getElementById("searchQuizDiv");
const searchQuizIndexButton = document.getElementById("searchQuizIndex");
searchQuizIndexButton.addEventListener("click", () => {
    hideDivs(searchQuizIndexDiv);
});


//---------------------------------------------------------------------------------------Create quiz
/**
 * Checks if a quiz name is unique by fetching existing quiz data from the server.
 * @param {string} name - The name of the quiz to check for uniqueness.
 * @returns {Promise<boolean>} - A promise that resolves with true if the quiz name is unique, otherwise false.
 */
async function IsQuizNameUnique(name){
    let result = false;
    const data = await fetchGetQuizData("/api/Getquizzes");
    if(!data){return;}
    data.quizzes.forEach(q => {
        if(q.quizName === name){
            result = true;
        } 
    });
    return result;
}

const creatQuizButton = document.getElementById("create_quiz_button");
creatQuizButton.addEventListener("click", () => {
    const name = document.getElementById("create_quiz_text").value;
    const safeName = escapeHtml(name);
    createQuizFunction(safeName);
});

// Access the createQuiz div if the name is unique and valid. 
async function createQuizFunction(name){
    const nameElement = document.getElementById("create_quiz_text");
    if (name === ""){
        errorMessage("Please insert a name",nameElement);
        return "noName";
    } else if(await IsQuizNameUnique(name)){
        errorMessage("Already created",nameElement);
        return "dublicate";
    } 
    const quizNameLabel = document.getElementById("quiz_name");
    quizNameLabel.textContent = decodeHtml(name);
    const createQuiz = document.getElementById("creat_quiz_div");
    hideDivs(createQuiz);

    return quizNameLabel;
}
    

/**
 * Event listener handler function for dynamically adding answer boxes to questions.
 * @param {Event} event - The event object triggered by the input element.
 */
function eventListenerHandler(event) {
    //The input element that called this function
    const elementThatTriggeredEvent = event.target;
    //The whole question div
    const DivThatTriggeredEvent = elementThatTriggeredEvent.parentNode.parentNode;
    createNewAnswerBox(elementThatTriggeredEvent,DivThatTriggeredEvent);
}

//This function create a new answer box to let the user dynamically add more answers.
function createNewAnswerBox(elementThatTriggeredEvent,DivThatTriggeredEvent){
    //Remove the EventListener because the new answer is created
    if(elementThatTriggeredEvent){
        elementThatTriggeredEvent.removeEventListener("input", eventListenerHandler);
    }
    //Get the last element in the current div e.g <div class="answer_container" id="answer_container4">
    let lastElementInCurrentDiv = DivThatTriggeredEvent.querySelectorAll(".answer_container");
    lastElementInCurrentDiv = lastElementInCurrentDiv[lastElementInCurrentDiv.length - 1];
    //Start id with -1 because if there is none answer then i should generate the first one and the next step is to increase the ID.
    let id = -1;
    //If there already is answer options then get the latest id. and the last input is the ID id="answer_container4"
    if(lastElementInCurrentDiv){
        id = lastElementInCurrentDiv.id[16];
    } 
    id++;
    //Ensure there is a limit of answers and the last . 
    if(id >= maxAnswers){
        //If theres is too many answers make an error message.
        errorMessage("You can max insert " + maxAnswers + " answers", lastElementInCurrentDiv);
        return "tooMany";
    }
    //Increase the ID with one to make the ID unique.

    //Create all the elements needed for an extra answers
    const questionDiv = createAllElement("div","answer_container"+id,"answer_container",null);

    //Label for answers
    const answerLabel = createAllElement("label","answer"+ id + "_label","answerLabel_class","Answer "+ (id+1) + ":");
    questionDiv.appendChild(answerLabel);

    //Answer input
    const answerText = createAllElement("input","answer"+id,"answer_text_class",null);
    answerText.type="text";
    questionDiv.appendChild(answerText);
    //Generate a EventListener for the new answer text input. 
    answerText.addEventListener("input", eventListenerHandler);

    //Correct answer checkbox
    const answerCheckbox = createAllElement("input","checkbox"+id,"answer_checkbox_class",null);
    answerCheckbox.type="checkbox";
    questionDiv.appendChild(answerCheckbox);
    
    DivThatTriggeredEvent.appendChild(questionDiv); 

    return questionDiv;
}

//Generate template for a new question
const appendNewQuestion = document.getElementById("append_new_question");
appendNewQuestion.addEventListener("click",createNewQuestion);

// Call it the first time to make the first one.
createNewQuestion();

// Generate the elements for generate a new quiz.
function createNewQuestion(){
    
    //Define the last created answer by taking the element afterward and use previousElementSibling to get the element before that e.g <div class="question_DIV" id="question_DIV0">
    const previousQuestionDiv = document.getElementById("append_new_question").previousElementSibling;

    //Make the number of question generated to -1 because it start by increase the numbers by one to make the new DIV.
    let questionNumber = -1;
    //Takes the last part of the ID. e.g "question_DIV1" where the 12 element is the last which is the ID.
    if (previousQuestionDiv.id.includes("question_DIV")){
        questionNumber = parseInt(previousQuestionDiv.id[12]);
    }
    questionNumber++;

    // Create the main div for the question
    const questionDiv = createAllElement("div","question_DIV" + questionNumber,"question_DIV",null);
    
    // Create label for the question
    const questionLabel = createAllElement("label","label" + questionNumber,"questionLabelClass","Question " + (questionNumber+1) + ":");

    // Create input field for the question
    const questionInput = createAllElement("input","question_txt_field" + questionNumber,"question_txt_field_class",null);
    questionInput.type = "text";

    // Append elements to the main question div
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);

    const appendQuestionButton = document.getElementById("append_new_question");
    //Insert them before the add new answer button to make the flow intuitive. 
    appendQuestionButton.parentNode.insertBefore(questionDiv, appendQuestionButton);

    //make the answer options
    createNewAnswerBox(null,questionDiv);

    return questionDiv;

}

// Public quiz button
const uploadQuizButton = document.getElementById("upload_quiz_button");
uploadQuizButton.addEventListener("click", getQuestionAndAnswers);

// This function append all the quiz data to the database.
async function getQuestionAndAnswers(){
    const quizName = escapeHtml(document.getElementById("quiz_name").textContent);
    const questionList = [];
    const answersList = [];
    const correctAnswersList = [];
    let quit = false;
    // Find all the questions dividers
    const numberOfQuestions = document.querySelectorAll(".question_DIV");
    numberOfQuestions.forEach(q =>{
        const question = q.querySelector(".question_txt_field_class").value;
        // If the question is = "" otherwise push it.
        if(!question){
            errorMessage("Please fill question",q);
            quit = true;
            return;
        }
        const safeQuestion = escapeHtml(question);
        questionList.push(safeQuestion);

        const answers = [];
        const correctAnswers = [];
        // Find all the answers in the current question divider.
        const answersValue = q.querySelectorAll(".answer_container");
        let emptyAnswers = 0;
        answersValue.forEach(a => {
            const answerText = a.querySelector(".answer_text_class").value;
            // Dont push if the answer is = "" otherwise push it.
            if(!answerText){
                emptyAnswers++;
                return;
            }
            const safeAnswerText = escapeHtml(answerText);
            answers.push(safeAnswerText);
            const answerCheckbox = a.querySelector(".answer_checkbox_class").checked;
            correctAnswers.push(answerCheckbox);
        });
        if(emptyAnswers === answersValue.length){
            errorMessage("Please add at least one answer option",q);
            quit = true;
            return;
        }

        answersList.push(answers);
        correctAnswersList.push(correctAnswers);
    });   
    if(quit){
        return "quit";
    }
    // Check if their is enough data to make a quiz
    if(answersList.length < 1 || !quizName || questionList.length <= 0){
        console.log(questionList.length);
        console.log("Not enough data");
        return "noData";
    }
    // Convert the data to JSON format.
    const data = {
        quizName: quizName,
        questionList: questionList,
        answersList: answersList,
        correctAnswersList: correctAnswersList
    };
    // Fetch the data to the database
    const uploadQuiz = await fetchPostQuizData("/uploadQuiz",data);
    if(uploadQuiz){
        alert("quiz is succesfully made");  

        //Clear questions and their answers after creating a question.
        clearQuizzes();

        // Search for all quizzes to append it.
        searchQuizzes(null);

        // Force the user to the quiz index menu and add a button with the new created quiz.
        const start = document.getElementById("quiz_index");
        hideDivs(start);
        const newCreatedQuiz = createAllElement("button","newCreatedQuiz","newCreatedQuiz","Start your quiz: \"" + decodeHtml(quizName) + "\"");
        newCreatedQuiz.style.backgroundColor = "red";        
        newCreatedQuiz.addEventListener("click", () => {
            startQuizSession(uploadQuiz.quiz.id);
        });
        start.appendChild(newCreatedQuiz);
    
        return true;
    } 
    alert("Failed to public quiz");
    return false;
    
    
}


//Clear questions and their answers after creating a question.
function clearQuizzes(){
    //Get all the elements with the class answer_container
    const inputDivs = document.querySelectorAll(".question_DIV");
    inputDivs.forEach(div => {
        div.remove();
    });
    createNewQuestion();
}


//---------------------------------------------------------------------------------------Search quizzes/Start Quiz Session


const searchQuizInput = document.getElementById("search_quiz_text");
searchQuizInput.addEventListener("input", () => {    
    searchQuizzes(escapeHtml(searchQuizInput.value));
});

/**
 * Searches quizzes based on the provided input and displays them in a table.
 * @param {string} input - The input string to search for in quiz names.
 * @returns {Promise<string|number>} - A promise that resolves with "noData" if there is no quiz data available,
 * otherwise the number of rows in the search result table.
 */
async function searchQuizzes(input){
    const data = await fetchGetQuizData("/api/Getquizzes");
    if(!data){
        return "noData";
    }
    const table = document.getElementById("search_quiz_table");
    //reset the table
    table.textContent = "";
    data.quizzes.forEach(quiz => {
        // Check if their is a input and if its in the quiz name
        if(input && quiz.quizName.toLowerCase().includes(input.toLowerCase()) || !input){
            const row = document.createElement("tr");

            const quizName = document.createElement("td");
            quizName.textContent = decodeHtml(quiz.quizName);
            row.appendChild(quizName);
    
            const startQuizButton = createAllElement("button","startQuizButtonId","startQuizButtonClass","Start Quiz");
            startQuizButton.addEventListener("click", () => {
                startQuizSession(quiz.id);
            });
            row.appendChild(startQuizButton);
    
            table.appendChild(row);
        } 

    });
    return table.rows.length;
}
searchQuizzes();


//---------------------------------------------------------------------------------------Join Quiz
const joinQuiz = document.getElementById("join_quiz_button");
joinQuiz.addEventListener("click", startQuiz);

//Start the quiz
async function startQuiz(){
    const userName = escapeHtml(document.getElementById("quizUsername").value);
    if(!userName){
        errorMessage("No name inserted",joinQuiz);
        return;
    }
    const sessionName = escapeHtml(document.getElementById("join_quiz_text").value);
    const sessionNameJSON = {sessionName: sessionName};
    const findSession = await fetchPostQuizData("/api/GetSpecificQuizSession",sessionNameJSON);
    
    if(!findSession.session){
        errorMessage("No sessions found",joinQuiz);
        return;
    }
    const quizOutput = document.getElementById("quiz_output");
    hideDivs(quizOutput);
    const quizId = findSession.session.QuizNameId;
    const div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    const quizIdJSON = {id: quizId};
    const data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    const jsonDisplayDiv = document.getElementById("quiz_output");
    

    const quizNameLabel = createAllElement("h1","quizNameLabel","quizNameLabelClass","name) " + decodeHtml(data.quiz.quizName));
    jsonDisplayDiv.appendChild(quizNameLabel);

    const sessionNameLabel = createAllElement("h2","quizSessionLabel","quizSessionLabelClass","session)" + sessionName); 
    jsonDisplayDiv.appendChild(sessionNameLabel);


    data.quiz.Questions.forEach((question , id) =>{

        //Create all the elements needed for an extra answers
        const questionDiv = createAllElement("div","q_container"+id,"q_container",null);

        // Questions
        const questionField = createAllElement("h3","question_field" + id,"question_fieldClass",(id + 1) + ") " + decodeHtml(question.questionText));
        questionDiv.appendChild(questionField);

        question.Answers.forEach((answer,i) =>{

            //Label for answers
            const answerLabel = createAllElement("label","answer"+ i + "_label","answerLabelClass", decodeHtml(answer.answerText));

            answerLabel.setAttribute("for", "answer"+ i);
            questionDiv.appendChild(answerLabel);


            //Correct answer checkbox
            const answerCheckbox = createAllElement("input","checkbox"+i,"answer_checkbox_class",null);
            answerCheckbox.type="checkbox";
            questionDiv.appendChild(answerCheckbox);
            const br = document.createElement("br");
            questionDiv.appendChild(br);
        });
        jsonDisplayDiv.appendChild(questionDiv);
    });                         
    
    const submitAnswers = createAllElement("button","submitId","submitId","Submit Answers");
    submitAnswers.type = "submit";
    jsonDisplayDiv.appendChild(submitAnswers);

    const submitAnswersButton = document.querySelector("#submitId");
    submitAnswersButton.addEventListener("click", () => {
        checkAnswers(quizId,sessionName,userName);
    });
    return data;
}


//---------------------------------------------------------------------------------------User input upload
/**
 * Checks user answers for a quiz session and sends the results to the server.
 * @param {string} quizId - The ID of the quiz being answered.
 * @param {string} sessionName - The name of the quiz session.
 */
async function checkAnswers(quizId,sessionName,userId){
    const quizIdJSON = {id: quizId};
    const data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    const userDataAnswerList = [];
    const userDataQuestion = document.querySelectorAll("#quiz_output .q_container");
    userDataQuestion.forEach(question =>{
        const QuestionAnswerList =[];
        const answersValue = question.querySelectorAll("#quiz_output .answer_checkbox_class");
        answersValue.forEach(answer => {
            QuestionAnswerList.push(answer.checked);
        });
        userDataAnswerList.push(QuestionAnswerList);        
    });
    const isCorrectList = [];
    data.quiz.Questions.forEach((question, questionIndex) => {
        const isQuestionCorrectList = [];
        question.Answers.forEach((answer, answerIndex) => {
            const isCorrect = answer.isCorrect === userDataAnswerList[questionIndex][answerIndex];
            isQuestionCorrectList.push(isCorrect);
        });
        isCorrectList.push(isQuestionCorrectList);
    });
    const userData = {
        session: sessionName,
        userId: userId,
        isCorrect: isCorrectList
    };
    await fetchPostQuizData("/api/insertQuizUserData",userData);

    userQuizResponse(userDataQuestion,isCorrectList);

    window.socket.emit("quizPing");

}
// Send the data to all(including the session leader) to receive live updates.
window.socket.on("quizPing", () => {
    teacherOverview();
});

//---------------------------------------------------------------------------------------Verify input
/**
 * Updates the visual feedback for user answers based on correctness.
 * @param {NodeListOf<Element>} questionElement - The list of question elements.
 * @param {boolean[][]} isCorrectList - The list of correctness for each answer.
 */
function userQuizResponse(questionElement,isCorrectList){
    questionElement.forEach((question,questionIndex) => {
        const answersValue = question.querySelectorAll("#quiz_output .answer_checkbox_class");
        answersValue.forEach((answer,answerIndex) => {
            if(!isCorrectList[questionIndex][answerIndex] && !answer.checked){
                answer.previousElementSibling.style.backgroundColor = "green";
            } else if(!isCorrectList[questionIndex][answerIndex] && answer.checked){
                answer.previousElementSibling.style.backgroundColor = "red";
            } else if (isCorrectList[questionIndex][answerIndex] && answer.checked){
                answer.previousElementSibling.style.backgroundColor = "green";
            }
        });
    });
    totalScore(isCorrectList);
}

/**
 * Calculates and displays the total score for the quiz.
 * @param {boolean[][]} isCorrectList - The list of correctness for each answer.
 */
function totalScore(isCorrectList){
    const question = document.querySelectorAll("#quiz_output .q_container");
    let totalQuestionSum = 0;
    question.forEach((question,questionIndex) => {
        // find sum of a boolean list
        const answersSum = isCorrectList[questionIndex].length;
        const questionSum = isCorrectList[questionIndex].filter(Boolean).length;

        let result = "Incorrect";
        if(questionSum === answersSum){
            totalQuestionSum++;
            result = "Correct";
        }
        const questionResult = createAllElement("h3","questionResult"+questionIndex,"questionResult",result);
        question.appendChild(questionResult);

    });

    const totalQuestionText = "Total) " + totalQuestionSum +"/"+question.length + " Correct";
    const totalQuestionResult = createAllElement("h2","totalQuestionResult","totalQuestionResult",totalQuestionText);

    const submitButton = document.getElementById("submitId");
    submitButton.parentNode.appendChild(totalQuestionResult); 
    submitButton.remove();
}


//---------------------------------------------------------------------------------------Start quiz session
/**
 * Generates HTML for displaying quiz session results.
 * @param {string} sessionName - The name of the quiz session.
 * @returns {Promise<string>} - A promise that resolves with "alreadyCreated" if a session is already opened,
 * "notFound" if no session is found with the provided name, otherwise resolves with the HTML content.
 */
async function quizSessionResultHtml(sessionName){
    // check if session is opened
    const sessionNameJSON = {sessionName: sessionName};
    const isSession = await fetchPostQuizData("/api/checkIfSessionIsOpened",sessionNameJSON);  
    
    const quizDiv = document.getElementById("quiz_output_results");
    hideDivs(quizDiv);
    if(isIdCreated("sessionCodeId")){
        errorMessage("You already have a session opened",quizDiv);
        return "alreadyCreated";
    } else if(!isSession.isSession){
        errorMessage("No session found with your input, please start a new", quizDiv);
        const start = document.getElementById("quiz_index");
        hideDivs(start);
        return "notFound";
    }

    const sessionCode = createAllElement("h3","sessionCodeId","sessionCodeId","Code: " + sessionName);

    const copyButton = createAllElement("button","copyQuizSession","copyQuizSession","Copy code");
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(sessionName);
    });

    const reloadData = createAllElement("button","quizReloadResult","quizReloadResult","Reload data");
    reloadData.addEventListener("click", teacherOverview);

    const endSession = createAllElement("button","endSessionButton","endSessionButton","End Session");
    endSession.addEventListener("click", () =>{
        endSessionFunction(sessionName);
    });

    const guide = createAllElement("button","startGuide","startGuide","?");
    guide.addEventListener("click", function() {
        hoverGuide(quizDiv);
    });


    sessionCode.appendChild(copyButton);
    sessionCode.appendChild(guide);
    quizDiv.appendChild(sessionCode);
    quizDiv.appendChild(reloadData);
    quizDiv.appendChild(endSession);
}

/**
 * Displays a guide for quiz session interaction when hovering over a specified session div.
 * @param {HTMLElement} sessiondiv - The HTML element representing the quiz session.
 */
function hoverGuide(sessiondiv){
    const checkDiv = document.getElementById("guideDiv");
    if(checkDiv){
        checkDiv.remove();
        return;
    }
    const div = createAllElement("div","guideDiv","guideDiv","");
    const guideText = "Please copy the code and send it to your friends. In the home menu they select \"Join Quiz\" and paste the code to access the quiz. When they submit their answers you will see there results in this page.";
    const text = createAllElement("p","textGuide","textGuide",guideText);
    div.appendChild(text);
    sessiondiv.appendChild(div);
}
/**
 * Ends the specified quiz session and updates the database.
 * @param {string} sessionName - The name of the quiz session to end.
 */
function endSessionFunction(sessionName){
    const startDiv = document.getElementById("quiz_home_screen");

    const JSON = {sessionName: sessionName};
    const closeSession = fetchPostQuizData("/api/endSession",JSON);
    if(!closeSession){
        hideDivs(start);
        errorMessage("Failed closing session",startDiv);
        return;
    }

    localStorage.removeItem("quizSessionId");
    document.getElementById("sessionCodeId").remove();
    
    const start = document.getElementById("quiz_index");
    hideDivs(start);
    errorMessage("Your session has been successfully ended",startDiv);
    const sessionDiv = document.getElementById("quiz_output_results");
    sessionDiv.innerHTML = "";
}

/**
 * Starts a quiz session for the specified quiz.
 * @param {string} quizId - The ID of the quiz to start the session for.
 * @returns {Promise<void>} - A promise with the session data.
 */
async function startQuizSession(quizId){
    if(!quizId){
        console.log("No quiz assosiated");
        return "noQuizId";
    }
    let sessionName = await fetchGetQuizData("/api/GetQuizSessions");
    if (sessionName.lastQuizSession) {
        sessionName = (sessionName.lastQuizSession.id + 1) + "q" + quizId;
    } else {
        sessionName = "0q" + quizId;
    }

    localStorage.setItem("quizSessionId",sessionName);
    const sessionNameJson = {
        sessionName: sessionName,
        quizId: quizId
    };
    const session = await fetchPostQuizData("/api/startQuizSession",sessionNameJson);
    
    await quizSessionResultHtml(sessionName);

    return session;
}

// const joinSession = document.getElementById("join_quiz_session_button");
// joinSession.addEventListener("click", () =>{
//     const sessionInput = document.getElementById("join_quiz_session").value;
//     quizSessionResultHtml(sessionInput);
// });

// This function is updating the users quizdata. It fetch all the userAnswer data in the database and make a table. 
async function teacherOverview(){
    const div = document.getElementById("quiz_output_results");

    // Remove current data. 
    if(isIdCreated("resultDiv")){
        document.getElementById("resultDiv").remove();
    }
    const resultDiv = createAllElement("div","resultDiv","resultDiv",null);
    div.appendChild(resultDiv);

    const session = localStorage.getItem("quizSessionId");
    
    const sessionJSON = {session:session};
    const data = await fetchPostQuizData("/api/userResponsData",sessionJSON);
    if(!data.quizData){
        errorMessage("No players have completed the quiz at this time.",div);
        return;
    }

    let totalQuestionCorrect = 0;

    const questions = data.quizData.QuizName.Questions;
    const table = document.createElement("table");
    table.id = "teacherOverviewTable";
    
    // Create table header row
    const headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    const questionRow = document.createElement("th");
    questionRow.textContent = "Question";
    headerRow.appendChild(questionRow);

    const userNamesList = [];
    
    // Loop through each question
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {     
        const question = questions[questionIndex];
        const tableRow = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = decodeHtml(question.questionText);
        tableRow.appendChild(th);

        const requestData = {
            session: data.quizData.id,
            questionId: question.id
        };

        const allAnswerSum = await fetchPostQuizData("/api/findQuestionScore", requestData);
        const sortedAnswerList = groupAnswersByUser(allAnswerSum.answers);
        
        let questionCorrect = 0;
        let questionCounter = 0;
        for (const name in sortedAnswerList) {
            if(questionIndex === 0){
                userNamesList.push(decodeHtml(name));
            }
            let result = "Wrong";
            let color = "red";
            if (sortedAnswerList[name].answers.every(answer => answer === true)) {
                result = "Correct";
                color = "green";
                questionCorrect++;
            }
            questionCounter++;
            const questionResult = name;
            const td = document.createElement("td");
            td.textContent = decodeHtml(questionResult);
            td.style.color = color;
            tableRow.appendChild(td);            
        }
        const questionResultTD = document.createElement("td");
        questionResultTD.textContent = questionCorrect + "/" + questionCounter;
        if (questionCorrect === questionCounter) {
            totalQuestionCorrect++;
            questionResultTD.style.color = "green";
        }
        tableRow.appendChild(questionResultTD);
        table.appendChild(tableRow);
    }
    userNamesList.forEach(user =>{
        const headerRowUser = document.createElement("th");
        headerRowUser.textContent = user;
        headerRow.appendChild(headerRowUser); 
    });

    const totalScoreRow = document.createElement("th");
    totalScoreRow.textContent = "Total Score";
    headerRow.appendChild(totalScoreRow);
    resultDiv.appendChild(table);
} 
/**
 * Groups quiz answers by user.
 * @param {object[]} data - The array of quiz answer data objects.
 * @returns {object} - An object containing grouped answers by user ID.
 */
function groupAnswersByUser(data) {
    const groupedAnswers = {};
    
    data.forEach(data => {
        if (!groupedAnswers[data.userId]) {
            groupedAnswers[data.userId] = { answers: [data.isCorrect] };
        } else {
            groupedAnswers[data.userId].answers.push(data.isCorrect);
        }
    });
    
    return groupedAnswers;
}

//---------------------------------------------------------------------------------------tests
// quizUnitTests();
async function quizUnitTests(){
    const pass = [];
    let passCounter = 0;    
    const fail = [];
    let failCounter = 0;

    await createQuizTest() ? (passCounter++, pass.push("create Quiz")) : (failCounter++, fail.push("create Quiz"));

    await createQuestions() ? (passCounter++, pass.push("create Question")) : (failCounter++, fail.push("create Question"));

    await publicQuiz() ? (passCounter++, pass.push("public Quiz")) : (failCounter++, fail.push("public Quiz"));

    await searchQuizTest() ? (passCounter++, pass.push("Search Quiz")) : (failCounter++, fail.push("Search Quiz"));

    await startSessionTest() ? (passCounter++, pass.push("Start Session")) : (failCounter++, fail.push("Start Session"));


    console.log("Pass: " , pass," Counter: ",passCounter);
    console.log("Fail: " , fail," Counter: ",failCounter);
    console.log("Total:" , passCounter , "/" , (passCounter+failCounter) , "Passed");
}
 
async function startSessionTest(){
    let result = true;

    let numberOfQuizzes = await fetchGetQuizData("/api/Getquizzes");
    numberOfQuizzes = numberOfQuizzes.quizzes.length;
    result = await startSessionTestHelper(1,-2,numberOfQuizzes);
    result = await startSessionTestHelper(22,-3,numberOfQuizzes);
    result = await startSessionTestHelper(988887,-4,numberOfQuizzes);

    return result;
}
async function startSessionTestHelper(id,slice,numberOfQuizzes){
    const startQuiz = await startQuizSession(id);
    if(id >= numberOfQuizzes && startQuiz){
        console.log("Dont make a quiz without a valid quizId");
        return false;
    } else if (id >= numberOfQuizzes && !startQuiz){
        return true;
    }
    if(!startQuiz){
        console.log("no data");
        return false;
    } 
    const sessionName = startQuiz.session.sessionName.slice(slice);
    if(sessionName !== ("q"+id)){
        console.log("Wrong sessionName",sessionName);
        return false;
    }
    return true;
} 

async function searchQuizTest(){
    let result = true;

    const noQuiz = await searchQuizzes("ASDASDASDASDASDASDASDASDASDASDASDASDASDASDASD");
    if(noQuiz !== 0){
        console.log("Failed searching quizzes");
        result = false;
    }

    const multipleQuiz = await searchQuizzes("2024");
    if(multipleQuiz < 2){
        console.log("Potentialle fail, check how many quizzes with 2024 that are made");
        result = false;
    }

    const oneQuiz = await searchQuizzes("test");
    if(oneQuiz !== 1){
        console.log("Potentialle fail, check how many quizzes with only test",oneQuiz);
        result = false;
    }
    searchQuizzes();


    return result;

}

async function publicQuiz(){
    let result = true;

    const quizDataNoQuestion = await getQuestionAndAnswers();
    if(quizDataNoQuestion !== "quit"){
        console.log("ignored no question text");
        result = false;
    }
    const missingQuestionDiv = document.getElementById("question_DIV0");
    const missingQuestion = missingQuestionDiv.querySelector("#question_txt_field0");
    missingQuestion.value = "TEST1";

    const quizDataNoAnswers = await getQuestionAndAnswers();
    if(quizDataNoAnswers !== "quit"){
        console.log("ignored no answer text for a question");
        result = false;
    }
    const missingAnswer = missingQuestionDiv.querySelector("#answer0");
    missingAnswer.value = "ANSWER1";

    const noData = await getQuestionAndAnswers();
    if(!noData || noData === "noData"){
        console.log("Not enough data to make quiz");
        result = false;
    }

    return result;


}

async function createQuizTest(){
    let result = true;
    const noName = await createQuizFunction("");
    if(noName !== "noName"){
        console.log("failed noName");
        result = false;
    }
    const uniqueName = new Date().toISOString();
    const makeQuiz = await createQuizFunction(uniqueName);
    if(makeQuiz.textContent !== uniqueName){
        console.log("failed creating Quiz");
        result = false;
    }
    const alreadyCreated = "test";
    const dublicate = await createQuizFunction(alreadyCreated);
    if(dublicate !== "dublicate"){
        console.log("failed dublicate");
        result = false;
    }
    return result;
}

async function createQuestions(){
    let result = true;

    const randomInt = Math.floor(Math.random() * 10) + 1;
    for(let i = 1; i < randomInt; i++){
        const questionDiv = createNewQuestion();
        const expectedID = "question_DIV"+i; 
        if(questionDiv.id !== expectedID){
            console.log("Wrong ID");
            result = false;
        }
        if(!questionDiv){
            console.log("No question created");
            result = false;
        }
        const label = questionDiv.querySelector(".questionLabelClass");
        if(!label){
            console.log("No label");
            result = false;
        }
        const input = questionDiv.querySelector(".question_txt_field_class");
        input.value = "Question"+i;
        if(!input){
            console.log("No input box");
            result = false;
        }
        const answerdiv = questionDiv.querySelector(".answer_container");
        if(!answerdiv){
            console.log("No input box");
            result = false;
        }
        const randomIntAnswer = Math.floor(Math.random() * 10) + 1;
        let createdAnswerCounter = 0;
        for(let j = 0; j < 10; j++){
            const answerInput = questionDiv.querySelectorAll(".answer_text_class");
            const lastElement = answerInput[answerInput.length - 1];
            lastElement.value = "TEST";
            const newanswerDiv = createNewAnswerBox(lastElement,questionDiv);
            if(newanswerDiv === "tooMany" && lastElement.id[6] >= maxAnswers){
                console.log("Too many answered added");
                result = false;
                return;
            } 
            if(newanswerDiv !== "tooMany"){
                createdAnswerCounter++;
            } 
            if(j === 0){
                const isCorrect = newanswerDiv.querySelector(".answer_checkbox_class");
                isCorrect.checked = "true";
            }


        }
        const numberOfAnswers = questionDiv.querySelectorAll(".answer_container").length - 1;
        // Minus one because the first one is created by the create question function
        if(numberOfAnswers !== createdAnswerCounter){
            console.log("Wrong amount of answers",numberOfAnswers,createdAnswerCounter);
            result = false;
        }

    }

    const allDiv = document.querySelectorAll(".question_DIV");
    if(allDiv.length !== randomInt){
        console.log("wrong number of div");
        result = false;
    }

    allDiv.forEach((div, index) => {
        if(index === 0){
            return;
        }
        let numberOfCorrectAnswers = 0;

        const checkBoxDiv = div.querySelectorAll(".answer_checkbox_class");
        checkBoxDiv.forEach(checkBox => {
            if(checkBox.checked){
                numberOfCorrectAnswers++;
            }
        });
        if(numberOfCorrectAnswers !== 1){
            console.log("Wrong amount of correct answers",numberOfCorrectAnswers);
            result = false;
        }
    });
    return result;
}

