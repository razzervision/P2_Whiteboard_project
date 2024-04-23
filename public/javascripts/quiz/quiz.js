//---------------------------------------------------------------------------------------Constants

//Maximum answer the user can insert. 
const max_answers = 5;

//---------------------------------------------------------------------------------------Helping funktions

//Check if the element is created
function isIdCreated(id){
    let element = document.getElementById(id);
    if (element) {
        return true;
    } else {
        return false;
    }
}

function errorMessage(message,placement){
    //Check if there already is a fail message
    if(isIdCreated("error_message")){
        document.getElementById("error_message").remove();
    }

    //Generate a error message for the user.
    let error = document.createElement("h4");
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
async function fetchAllQuizData() {
    try {
        const response = await fetch("/api/Getquizzes");
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

async function fetchPostQuizData(link,id) {
    try {
        // Send the data to the server-side script
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id),
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



//Check if the quiz name already exist
async function IsQuizNameUnique(name){
    let result = false;
    let data = await fetchAllQuizData();
    data.quizzes.forEach(q => {
        if(q.quizName === name){
            result = true;
        } 
    });
    return result;
}

function hideDivs(show) {
    let start = document.getElementById("quiz_index");
    let createQuiz = document.getElementById("creat_quiz_div");
    let quizOutput = document.getElementById("quiz_output");
    let quizResult = document.getElementById("quiz_output_results");

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
    let element = document.createElement(type);
    element.id = id;
    element.className = className
    element.textContent = textContent;
    return element;
}


//---------------------------------------------------------------------------------------Home page
//Home button
let homeScreenButton = document.getElementById("quiz_home_screen");
homeScreenButton.addEventListener("click", () => {
    hideDivs("start");
});










//---------------------------------------------------------------------------------------Create quiz

let creat_quiz = document.getElementById("create_quiz_button");
creat_quiz.addEventListener("click", async() => {
    let name = document.getElementById("create_quiz_text").value;
    if(await IsQuizNameUnique(name)){
        errorMessage("Already created",creat_quiz);
    } else {
        hideDivs("createQuiz");
        let quizName = document.getElementById("quiz_name");
        quizName.textContent = name; 
    }
});

//Generate a new answers input when typing on the first answer text input. 
function eventListenerHandler(event) {
    //The input element that called this function
    let elementThatTriggeredEvent = event.target;
    //The whole question div
    let DivThatTriggeredEvent = elementThatTriggeredEvent.parentNode.parentNode;
    create_new_answer_box(elementThatTriggeredEvent,DivThatTriggeredEvent);
}

//This function create a new answer box to let the user dynamically add more answers.
function create_new_answer_box(elementThatTriggeredEvent,DivThatTriggeredEvent){
    //Remove the EventListener because the new answer is created
    if(elementThatTriggeredEvent){
        elementThatTriggeredEvent.removeEventListener("input", eventListenerHandler);
    }
    //Get the last element in the current div e.g <div class="answer_container" id="answer_container4">
    let lastElementInCurrentDiv = DivThatTriggeredEvent.lastElementChild;

    //Start id with -1 because if there is none answer then i should generate the first one and the next step is to increase the ID.
    let id = -1;
    //If there already is answer options then get the latest id. and the last input is the ID id="answer_container4"
    if(lastElementInCurrentDiv.className === "answer_container"){
        id = lastElementInCurrentDiv.id[16];
    }
    //Ensure there is a limit of answers and the last . 
    if(id < max_answers - 1){

        //Increase the ID with one to make the ID unique.
        id++;
        let userFrindlyId = id+1;

        //Create all the elements needed for an extra answers
        let questionDiv = document.createElement("div");
        questionDiv.className = "answer_container";
        questionDiv.id = "answer_container"+id;

        //Label for answers
        let answerLabel = document.createElement("label");
        answerLabel.textContent = "Answer "+ userFrindlyId + ":";
        answerLabel.id = "answer"+ id + "_label";
        answerLabel.className="answerLabel_class";
        answerLabel.setAttribute("for", "answer"+ id);
        questionDiv.appendChild(answerLabel);

        //Answer input
        let answerText = document.createElement("input");
        answerText.type="text";
        answerText.id = "answer"+id;
        answerText.className="answer_text_class";
        questionDiv.appendChild(answerText);
        //Generate a EventListener for the new answer text input. 
        answerText.addEventListener("input", eventListenerHandler);

        //Correct answer checkbox
        let answerCheckbox = document.createElement("input");
        answerCheckbox.type="checkbox";
        answerCheckbox.id = "checkbox"+id;
        answerCheckbox.className = "answer_checkbox_class";
        questionDiv.appendChild(answerCheckbox);
        
        DivThatTriggeredEvent.appendChild(questionDiv);

    } else {
        //If theres is too many answers make an error message.
        errorMessage("You can max insert " + max_answers + " answers", DivThatTriggeredEvent);
    }
}

//Generate template for a new question
const append_new_question = document.getElementById("append_new_question");
append_new_question.addEventListener("click", () =>{
    create_new_question();
});
// Call it the first time to make the first one.
create_new_question();
function create_new_question(){
    
    //Define the last created answer by taking the element afterward and use previousElementSibling to get the element before that e.g <div class="question_DIV" id="question_DIV0">
    let previousQuestionDiv = document.getElementById("append_new_question").previousElementSibling;

    //Make the number of question generated to -1 because it start by increase the numbers by one to make the new DIV.
    let questionNumber = -1;
    //Takes the last part of the ID. e.g "question_DIV1" where the 12 element is the last which is the ID.
    if (previousQuestionDiv.id.includes("question_DIV")){
        questionNumber = parseInt(previousQuestionDiv.id[12]);
    }
    questionNumber++;
    //This make a ID that is more userfriendly so that it is called question 1 instead of question 0 to the user. 
    let userFrindlyId = questionNumber + 1;

    // Create the main div for the question
    var questionDiv = document.createElement("div");
    questionDiv.classList.add("question_DIV");
    questionDiv.id = "question_DIV" + questionNumber;
    
    // Create label for the question
    var questionLabel = document.createElement("label");
    questionLabel.htmlFor = "question_txt_field";
    questionLabel.id = "label" + questionNumber;
    questionLabel.textContent = "Question " + userFrindlyId + ":";

    // Create input field for the question
    var questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.id = "question_txt_field" + questionNumber;
    questionInput.name = "question_txt_field";
    questionInput.className = "question_txt_field_class";

    // Append elements to the main question div
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);

    let appendQuestionButton = document.getElementById("append_new_question");
    //Insert them before the add new answer button to make the flow intuitive. 
    appendQuestionButton.parentNode.insertBefore(questionDiv, appendQuestionButton);

    //make the answer options
    create_new_answer_box(null,questionDiv);

}


let uploadQuizButton = document.getElementById("upload_quiz_button");
uploadQuizButton.addEventListener("click", get_question_and_answers);

function get_question_and_answers(){
    let quizName = document.getElementById("quiz_name").textContent;
    let questionList = [];
    let answersList = [];
    let correctAnswersList = [];

    let numberOfQuestions = document.querySelectorAll(".question_DIV");
    numberOfQuestions.forEach((q, index) =>{
        let question = q.querySelector(".question_txt_field_class").value;
        questionList.push(question);

        let answers = [];
        let correctAnswers = [];
        let answersValue = q.querySelectorAll(".answer_container");
        answersValue.forEach(a => {
            let answerText = a.querySelector(".answer_text_class").value;
            answers.push(answerText)
            let answerCheckbox = a.querySelector(".answer_checkbox_class").checked;
            correctAnswers.push(answerCheckbox)
        });

        answersList.push(answers);
        correctAnswersList.push(correctAnswers);
    });   

    const data = {
        quizName: quizName,
        questionList: questionList,
        answersList: answersList,
        correctAnswersList: correctAnswersList
    };
    // Send the data to the server-side script
    fetch('/uploadQuiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data has been successfully saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    //Clear questions and their answers after creating a question.
    clear_questions();
}



//Clear questions and their answers after creating a question.
function clear_questions(){
    //Get all the elements with the class answer_container
    let input_divs = document.querySelectorAll(".question_DIV");
    input_divs.forEach(div => {
        div.remove();
    });
    create_new_question();

}









//---------------------------------------------------------------------------------------Search quizzes


let searchQuizInput = document.getElementById("search_quiz_text");
searchQuizInput.addEventListener("input", () => {
    search_quizzes(searchQuizInput.value);
});

//Find all unique quizzes
async function search_quizzes(input){
    let data = await fetchAllQuizData();
       
    let table = document.getElementById("search_quiz_table");
    //reset the table
    table.textContent = "";
    data.quizzes.forEach(quiz => {
        // Check if their is a input and if its in the quiz name
        if(input && quiz.quizName.toLowerCase().includes(input.toLowerCase()) || !input){
            let row = document.createElement("tr");

            let quizName = document.createElement("td");
            quizName.textContent = quiz.quizName;
            row.appendChild(quizName);
    
            let start_quiz_button = document.createElement("button");
            start_quiz_button.textContent = "Start Quiz";
            start_quiz_button.className = "start_quiz_button";
            start_quiz_button.addEventListener("click", () => {
                startQuizSession(quiz.id);
            });
            row.appendChild(start_quiz_button);
    
            table.appendChild(row);
        } 

    });
}
search_quizzes();











//---------------------------------------------------------------------------------------Join Quiz
let joinQuiz = document.getElementById("join_quiz_button");
joinQuiz.addEventListener("click", startQuiz);

//Start the quiz
async function startQuiz(){
    let sessionName = document.getElementById("join_quiz_text").value;
    let sessionNameJSON = {sessionName: sessionName};
    let findSession = await fetchPostQuizData("/api/GetSpecificQuizSession",sessionNameJSON);
    
    if(!findSession.session){
        errorMessage("No sessions found",joinQuiz);
        return 0;
    }
    hideDivs("quizOutput");
    let quizId = findSession.session.QuizNameId;
    let div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    let quizIdJSON = {id: quizId};
    let data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    const jsonDisplayDiv = document.getElementById("quiz_output");

    let quizNameLabel = document.createElement("h1");
    quizNameLabel.id = "quizNameLabel"
    quizNameLabel.textContent = "name) " + data.quiz.quizName;
    jsonDisplayDiv.appendChild(quizNameLabel);

    let sessionNameLabel = document.createElement("h2");
    sessionNameLabel.id = "quizSessionLabel";
    sessionNameLabel.textContent = "session)" + sessionName;
    jsonDisplayDiv.appendChild(sessionNameLabel);


    data.quiz.Questions.forEach((question , id) =>{

        //Create all the elements needed for an extra answers
        let questionDiv = document.createElement("div");
        questionDiv.className = "q_container";
        questionDiv.id = "q_container"+id;

        // Questions
        let questionField = document.createElement("h3");
        questionField.id = "question_field" + id;
        questionField.textContent = (id + 1) + ") " + question.questionText;
        questionDiv.appendChild(questionField);

        question.Answers.forEach((answer,i) =>{

            //Label for answers
            let answerLabel = document.createElement("label");
            answerLabel.textContent = answer.answerText;
            answerLabel.id = "answer"+ i + "_label";
            answerLabel.className="answerLabel_class";
            answerLabel.setAttribute("for", "answer"+ i);
            questionDiv.appendChild(answerLabel);

            //Correct answer checkbox
            let answerCheckbox = document.createElement("input");
            answerCheckbox.type="checkbox";
            answerCheckbox.id = "checkbox"+i;
            answerCheckbox.className = "answer_checkbox_class";
            questionDiv.appendChild(answerCheckbox);
        });
        jsonDisplayDiv.appendChild(questionDiv);
    });                         

    let submitAnswers = document.createElement("button");
    submitAnswers.id = "submitId";
    submitAnswers.type = "submit";
    submitAnswers.textContent = "Submit Answers";
    jsonDisplayDiv.appendChild(submitAnswers);

    submitAnswersButton = document.querySelector("#submitId");
    submitAnswersButton.addEventListener("click", () => {
        checkAnswers(quizId,sessionName);
    });
}











//---------------------------------------------------------------------------------------User input upload
async function checkAnswers(quizId,sessionName){
    let quizIdJSON = {id: quizId};
    let data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    let userDataAnswerList = [];
    let userDataQuestion = document.querySelectorAll("#quiz_output .q_container");
    userDataQuestion.forEach(question =>{
        let QuestionAnswerList =[];
        let answersValue = question.querySelectorAll("#quiz_output .answer_checkbox_class");
        answersValue.forEach(answer => {
            QuestionAnswerList.push(answer.checked);
        });
        userDataAnswerList.push(QuestionAnswerList);        
    });
    let isCorrectList = [];
    data.quiz.Questions.forEach((question, questionIndex) => {
        isQuestionCorrectList = [];
        question.Answers.forEach((answer, answerIndex) => {
            let isCorrect = answer.isCorrect === userDataAnswerList[questionIndex][answerIndex];
            isQuestionCorrectList.push(isCorrect)
        });
        isCorrectList.push(isQuestionCorrectList);
    });
    userData = {
        session: sessionName,
        userId: "Kung Fu Panda",
        isCorrect: isCorrectList
    }
    await fetchPostQuizData("/api/insertQuizUserData",userData);

    userQuizResponse(userDataQuestion,isCorrectList);

}





//---------------------------------------------------------------------------------------Verify input
function userQuizResponse(questionElement,isCorrectList){
    questionElement.forEach((question,questionIndex) => {
        let answersValue = question.querySelectorAll("#quiz_output .answer_checkbox_class");
        answersValue.forEach((answer,answerIndex) => {
            if(isCorrectList[questionIndex][answerIndex]){
                answer.previousElementSibling.style.backgroundColor = "green";
            } else {
                answer.previousElementSibling.style.backgroundColor = "red";
            }
        });
    });
    totalScore(isCorrectList);
}

function totalScore(isCorrectList){
    let question = document.querySelectorAll("#quiz_output .q_container");
    let totalSum = 0;
    let totalAnswers = 0;
    let totalQuestionSum = 0;
    question.forEach((question,questionIndex) => {
        // find sum of a boolean list
        let answersSum = isCorrectList[questionIndex].length;
        let questionSum = isCorrectList[questionIndex].filter(Boolean).length;
        let questionResult = document.createElement("h3");
        questionResult.id = "questionResult"+questionIndex;
        questionResult.className = "questionResult";
        questionResult.textContent = questionSum +"/"+answersSum + "correct";

        question.appendChild(questionResult);
        totalSum += questionSum;
        totalAnswers += answersSum;
        if(questionSum === answersSum){
            totalQuestionSum += 1;
        }
    });
    let submitButton = document.getElementById("submitId");
    
    let totalResult = document.createElement("h2");
    totalResult.id = "totalResult";
    totalResult.className = "totalResult";
    totalResult.textContent = "Total Answers) " + totalSum +"/"+totalAnswers + " correct";
    submitButton.parentNode.appendChild(totalResult); 

    
    let totalQuestionResult = document.createElement("h2");
    totalQuestionResult.id = "totalQuestionResult";
    totalQuestionResult.className = "totalQuestionResult";
    totalQuestionResult.textContent = "Total Questions) " + totalQuestionSum +"/"+question.length + " correct";
    submitButton.parentNode.appendChild(totalQuestionResult); 
    submitButton.remove();
}






//---------------------------------------------------------------------------------------Start quiz session

async function startQuizSession(quizId){
    // Make the session name current time in milliseconds + the quiz id number
    const currentTimeInMilliseconds = Date.now();
    const sessionName = currentTimeInMilliseconds + "q" + quizId;
    localStorage.setItem("sessionId",sessionName);
    let sessionNameJson = {
        sessionName: sessionName,
        quizId: quizId
    };
    await fetchPostQuizData("/api/startQuizSession",sessionNameJson);

    let quizDiv = document.getElementById("quiz_output_results");
    hideDivs("quizResult");
    if(isIdCreated("sessionCodeId")){
        errorMessage("You alredy have a session opened",quizDiv);
        return 0;
    }
    let sessionCode = document.createElement("h3");
    sessionCode.id = "sessionCodeId";
    sessionCode.textContent = "Code: " + sessionName;

    let copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(sessionName);
    });

    let reloadData = document.createElement("button");
    reloadData.textContent = "Reload";
    reloadData.addEventListener("click", teacherOverview);

    let endSession = document.createElement("button");
    endSession.textContent = "End Session";
    endSession.addEventListener("click", teacherOverview);

    quizDiv.appendChild(sessionCode);
    quizDiv.appendChild(copyButton);
    quizDiv.appendChild(reloadData);
    quizDiv.appendChild(endSession);



}


async function teacherOverview(){
    let div = document.getElementById("quiz_output_results");
    let session = localStorage.getItem("sessionId");
    let sessionJSON = {session:session};
    let data = await fetchPostQuizData("/api/userResponsData",sessionJSON);
    let totalSum = 0;
    let totalAnswers = 0;
    let totalQuestionSum = 0;

    let questions = data.quizData.QuizName.Questions;
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
        let answerCorrect = 0;
        let questionSum = 0;

        let question = questions[questionIndex];

        let JSON = {
            session: data.quizData.id,
            questionId: question.id
        }
        let answerSum = await fetchPostQuizData("/api/findQuestionScore", JSON);
        answerSum.answers.forEach(answer => {
            if(answer.isCorrect){
                answerCorrect += 1;
            }
            questionSum += 1;
        });
        let questionResult = question.questionText + ")  "+ answerCorrect+"/"+questionSum+" Is correct";
        let questionLabel = createAllElement("h3", "teacherOverview", "teacherOverview", questionResult);
        div.appendChild(questionLabel);
    }



    // question.forEach((question,questionIndex) => {
    //     // find sum of a boolean list
    //     let answersSum = isCorrectList[questionIndex].length;
    //     let questionSum = isCorrectList[questionIndex].filter(Boolean).length;

    //     question.appendChild(questionResult);
    //     totalSum += questionSum;
    //     totalAnswers += answersSum;
    //     if(questionSum === answersSum){
    //         totalQuestionSum += 1;
    //     }
    // });
    // let submitButton = document.getElementById("submitId");
    
    // let totalResult = document.createElement("h2");
    // totalResult.id = "totalResult";
    // totalResult.className = "totalResult";
    // totalResult.textContent = "Total Answers) " + totalSum +"/"+totalAnswers + " correct";
    // submitButton.parentNode.appendChild(totalResult); 

    
    // let totalQuestionResult = document.createElement("h2");
    // totalQuestionResult.id = "totalQuestionResult";
    // totalQuestionResult.className = "totalQuestionResult";
    // totalQuestionResult.textContent = "Total Questions) " + totalQuestionSum +"/"+question.length + " correct";
    // submitButton.parentNode.appendChild(totalQuestionResult); 
    // submitButton.remove();
}   




//---------------------------------------------------------------------------------------tests


//Default questions for test
function autofill(){
    let name = document.getElementById("quiz_name");
    name.value="CS2";

    let question = document.getElementById("question_txt_field");
    question.value="Hvem er bedst til CS?";

    let answer0 = document.getElementById("answer0");
    answer0.value= "Rantzau";

    let answer0_checked = document.getElementById("checkbox0");
    
    answer0_checked.checked = "true";

}
// autofill();

