//---------------------------------------------------------------------------------------Constants

//Maximum answer the user can insert. 
const maxAnswers = 5;

//socket.io
// const serverURLForSocket = document.location.origin;
// const window.socket = io(serverURLForSocket, {autoConnect: false});

//---------------------------------------------------------------------------------------Helping funktions

//Check if the element is created
function isIdCreated(id){
    const element = document.getElementById(id);
    if (element) {
        return true;
    } 
    return false;
    
}

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
    }, 5000);
}

//this function return all the data from the quiz.json file.
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


function hideDivs(show) {
    const start = document.getElementById("quiz_index");
    const createQuiz = document.getElementById("creat_quiz_div");
    const quizOutput = document.getElementById("quiz_output");
    const quizResult = document.getElementById("quiz_output_results");

    // Hide all elements first
    start.style.display = "none";
    createQuiz.style.display = "none";
    quizOutput.style.display = "none";
    quizResult.style.display = "none";
    // Show the element based on the parameter
    if (show === "start") {
        start.style.display = "block";
    } else if (show === "createQuiz") {
        createQuiz.style.display = "block";
    } else if (show === "quizOutput") {
        quizOutput.style.display = "block";
    } else if (show === "quizResult") {
        quizResult.style.display = "block";
    }
}


function createAllElement(type,id,className,textContent){
    const element = document.createElement(type);
    element.id = id;
    element.className = className;
    element.textContent = textContent;
    return element;
}


//---------------------------------------------------------------------------------------Home page
//Home button
const homeScreenButton = document.getElementById("quiz_home_screen");
homeScreenButton.addEventListener("click", () => {
    hideDivs("start");
});


//---------------------------------------------------------------------------------------Create quiz
//Check if the quiz name already exist
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
    createQuizFunction(name);
});

async function createQuizFunction(name){
    nameElement = document.getElementById("create_quiz_text");
    if (name === ""){
        errorMessage("Please insert a name",nameElement);
        return "noName";
    } else if(await IsQuizNameUnique(name)){
        errorMessage("Already created",nameElement);
        return "dublicate";
    } 
    hideDivs("createQuiz");
    const quizNameLabel = document.getElementById("quiz_name");
    quizNameLabel.textContent = name;
    return quizNameLabel;
}
    

//Generate a new answers input when typing on the first answer text input. 
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


const uploadQuizButton = document.getElementById("upload_quiz_button");
uploadQuizButton.addEventListener("click", getQuestionAndAnswers);

async function getQuestionAndAnswers(){
    const quizName = document.getElementById("quiz_name").textContent;
    const questionList = [];
    const answersList = [];
    const correctAnswersList = [];
    let quit = false;
    const numberOfQuestions = document.querySelectorAll(".question_DIV");
    numberOfQuestions.forEach(q =>{
        const question = q.querySelector(".question_txt_field_class").value;
        // If the question is = ""
        if(!question){
            errorMessage("Please fill question",q);
            quit = true;
            return;
        }
        questionList.push(question);

        const answers = [];
        const correctAnswers = [];
        const answersValue = q.querySelectorAll(".answer_container");
        let emptyAnswers = 0;
        answersValue.forEach(a => {
            const answerText = a.querySelector(".answer_text_class").value;
            // Dont push if the answer is = ""
            if(!answerText){
                emptyAnswers++;
                return;
            }
            answers.push(answerText);
            const answerCheckbox = a.querySelector(".answer_checkbox_class").checked;
            correctAnswers.push(answerCheckbox);
        });
        if(emptyAnswers === answersValue.length){
            quit = true;
            return
        }

        answersList.push(answers);
        correctAnswersList.push(correctAnswers);
    });   
    if(quit){
        return "quit";
    }
    const data = {
        quizName: quizName,
        questionList: questionList,
        answersList: answersList,
        correctAnswersList: correctAnswersList
    };

    const uploadQuiz = await fetchPostQuizData("/uploadQuiz",data);

    hideDivs("start");
    if(uploadQuiz){
        alert("quiz is succesfully made");  
    }
    
    //Clear questions and their answers after creating a question.
    clearQuizzes();

    // Search for all quizzes to append it.
    searchQuizzes(null);

    return true;
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


//---------------------------------------------------------------------------------------Search quizzes


const searchQuizInput = document.getElementById("search_quiz_text");
searchQuizInput.addEventListener("input", () => {
    searchQuizzes(searchQuizInput.value);
});

//Find all unique quizzes
async function searchQuizzes(input){
    const data = await fetchGetQuizData("/api/Getquizzes");
    if(!data){return;}
    const table = document.getElementById("search_quiz_table");
    //reset the table
    table.textContent = "";
    data.quizzes.forEach(quiz => {
        // Check if their is a input and if its in the quiz name
        if(input && quiz.quizName.toLowerCase().includes(input.toLowerCase()) || !input){
            const row = document.createElement("tr");

            const quizName = document.createElement("td");
            quizName.textContent = quiz.quizName;
            row.appendChild(quizName);
    
            const startQuizButton = createAllElement("button","startQuizButtonId","startQuizButtonClass","Start Quiz");
            startQuizButton.addEventListener("click", () => {
                startQuizSession(quiz.id);
            });
            row.appendChild(startQuizButton);
    
            table.appendChild(row);
        } 

    });
}
searchQuizzes();


//---------------------------------------------------------------------------------------Join Quiz
const joinQuiz = document.getElementById("join_quiz_button");
joinQuiz.addEventListener("click", startQuiz);

//Start the quiz
async function startQuiz(){
    const sessionName = document.getElementById("join_quiz_text").value;
    const sessionNameJSON = {sessionName: sessionName};
    const findSession = await fetchPostQuizData("/api/GetSpecificQuizSession",sessionNameJSON);
    
    if(!findSession.session){
        errorMessage("No sessions found",joinQuiz);
        return 0;
    }
    hideDivs("quizOutput");
    const quizId = findSession.session.QuizNameId;
    const div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    const quizIdJSON = {id: quizId};
    const data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    const jsonDisplayDiv = document.getElementById("quiz_output");

    // Username
    const userIdLabel = createAllElement("label","userIdLabel","userIdLabel","Username");
    userIdLabel.setAttribute("for", "quizUsername");
    jsonDisplayDiv.appendChild(userIdLabel);

    const userId = createAllElement("input","quizUsername","quizUsername",null);
    userId.type = "text";
    jsonDisplayDiv.appendChild(userId);

    const quizNameLabel = createAllElement("h1","quizNameLabel","quizNameLabelClass","name) " + data.quiz.quizName);
    jsonDisplayDiv.appendChild(quizNameLabel);

    const sessionNameLabel = createAllElement("h2","quizSessionLabel","quizSessionLabelClass","session)" + sessionName); 
    jsonDisplayDiv.appendChild(sessionNameLabel);


    data.quiz.Questions.forEach((question , id) =>{

        //Create all the elements needed for an extra answers
        const questionDiv = createAllElement("div","q_container"+id,"q_container",null);

        // Questions
        const questionField = createAllElement("h3","question_field" + id,"question_fieldClass",(id + 1) + ") " + question.questionText);
        questionDiv.appendChild(questionField);

        question.Answers.forEach((answer,i) =>{

            //Label for answers
            const answerLabel = createAllElement("label","answer"+ i + "_label","answerLabelClass",answer.answerText);

            answerLabel.setAttribute("for", "answer"+ i);
            questionDiv.appendChild(answerLabel);

            //Correct answer checkbox
            const answerCheckbox = createAllElement("input","checkbox"+i,"answer_checkbox_class",null);
            answerCheckbox.type="checkbox";
            questionDiv.appendChild(answerCheckbox);
        });
        jsonDisplayDiv.appendChild(questionDiv);
    });                         

    const submitAnswers = createAllElement("button","submitId","submitId","Submit Answers");
    submitAnswers.type = "submit";
    jsonDisplayDiv.appendChild(submitAnswers);

    const submitAnswersButton = document.querySelector("#submitId");
    submitAnswersButton.addEventListener("click", () => {
        checkAnswers(quizId,sessionName);
    });
}


//---------------------------------------------------------------------------------------User input upload
async function checkAnswers(quizId,sessionName){
    const userId = document.getElementById("quizUsername").value;
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

window.socket.on("quizPing", () => {
    teacherOverview();
});

//---------------------------------------------------------------------------------------Verify input
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
async function quizSessionResultHtml(sessionName){
    // check if session is opened
    const sessionNameJSON = {sessionName: sessionName};
    const isSession = await fetchPostQuizData("/api/checkIfSessionIsOpened",sessionNameJSON);  
    
    const quizDiv = document.getElementById("quiz_output_results");
    hideDivs("quizResult");
    if(isIdCreated("sessionCodeId")){
        errorMessage("You already have a session opened",quizDiv);
        return 0;
    } else if(!isSession.isSession){
        errorMessage("No session found with your input, please start a new", quizDiv);
        hideDivs("start");
        return 0;
    }

    const sessionCode = createAllElement("h3","sessionCodeId","sessionCodeId","Code: " + sessionName);

    const copyButton = createAllElement("button","copyQuizSession","copyQuizSession","Copy code");
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(sessionName);
    });

    const reloadData = createAllElement("button","quizReloadResult","quizReloadResult","Reload data");
    reloadData.addEventListener("click", teacherOverview);

    const endSession = createAllElement("button","endSessionButton","endSessionButton","End Session");
    endSession.addEventListener("click", endSessionFunction);

    sessionCode.appendChild(copyButton);
    quizDiv.appendChild(sessionCode);
    quizDiv.appendChild(reloadData);
    quizDiv.appendChild(endSession);
}

function endSessionFunction(){
    const startDiv = document.getElementById("quiz_home_screen");
    const sessionName = localStorage.getItem("quizSessionId");

    localStorage.removeItem("quizSessionId");
    document.getElementById("sessionCodeId").remove();
    hideDivs("start");
    errorMessage("Your session has been successfully ended",startDiv);
}

async function startQuizSession(quizId){
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
    await fetchPostQuizData("/api/startQuizSession",sessionNameJson);

    quizSessionResultHtml(sessionName);
}

const joinSession = document.getElementById("join_quiz_session_button");
joinSession.addEventListener("click",joinSessionResult);

function joinSessionResult(){
    const sessionInput = document.getElementById("join_quiz_session").value;
    quizSessionResultHtml(sessionInput);
}


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
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {        
        const question = questions[questionIndex];
        const questionText = createAllElement("h1","questionText"+questionIndex,"questionText",question.questionText + ":");
        resultDiv.appendChild(questionText);
        const JSON = {
            session: data.quizData.id,
            questionId: question.id
        };
        const answerSum = await fetchPostQuizData("/api/findQuestionScore", JSON);
        const sortedAnswerList = groupAnswersByUser(answerSum.answers);

        let questionsCorrect = 0;
        let questionCounter = 0;
        Object.entries(sortedAnswerList).forEach(([name, { answers }]) => {
            let result = "Wrong";
            let color = "red";
            if(answers.every(answer => answer === true)){
                result = "Correct";
                color = "green";
                questionsCorrect++;
            }
            questionCounter++;
            const questionResult = name + " Answered " + result;
            const questionLabel = createAllElement("h3", "teacherOverview", "teacherOverview", questionResult);
            questionLabel.style.color=color;
            resultDiv.appendChild(questionLabel);
        });

        const totalQuestionLabelText = questionsCorrect + "/" + questionCounter + " Correct";
        const totalQuestionLabel = createAllElement("h2","totalQuestionLabel","totalQuestionLabel",totalQuestionLabelText);
        resultDiv.appendChild(totalQuestionLabel);
        if(questionsCorrect === questionCounter){
            totalQuestionCorrect++;
        }
    }  

    const totalResultText = "Total: " + totalQuestionCorrect + "/" + questions.length + " Correct";
    const totalResultElement = createAllElement("h1","totalResultElement","totalResultElement",totalResultText);
    resultDiv.appendChild(totalResultElement);
} 

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

    await publicQuiz() ? (passCounter++, pass.push("public Quiz")) : (failCounter++, fail.push("create Question"));


    console.log("total Passed Test: " , passCounter);
    console.log("Passed Tests: " , pass);
    console.log("total Failed Test: " , failCounter);
    console.log("Failed Tests: " , fail);
    console.log("Total:" , passCounter , "/" , (passCounter+failCounter) , "Passed");
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

    const succesQuiz = await getQuestionAndAnswers();
    if(!succesQuiz){

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
    const uniqueName = "TESTT";
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



