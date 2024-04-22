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
    placement.appendChild(error);

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
        console.log(q.quizName);
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

    // Hide all elements first
    start.style.display = "none";
    createQuiz.style.display = "none";
    quizOutput.style.display = "none";

    // Show the element based on the parameter
    if (show === "start") {
        start.style.display = "block";
    } else if (show === "createQuiz") {
        createQuiz.style.display = "block";
    } else if (show === "quizOutput") {
        quizOutput.style.display = "block";
    }
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
    console.log(data);
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

//---------------------------------------------------------------------------------------Start quiz

async function startQuizSession(quizId){
    // Make the session name current time in milliseconds + the quiz id number
    const currentTimeInMilliseconds = Date.now();
    const sessionName = currentTimeInMilliseconds + "q" + quizId;
    let sessionNameJson = {
        sessionName: sessionName,
        quizId: quizId
    };
    let data = await fetchPostQuizData("/api/startQuizSession",sessionNameJson);
    let sessionCode = document.createElement("h3");
    sessionCode.id = "sessionCodeId";
    sessionCode.textContent = "Code: " + sessionName;

    let copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(sessionName);
    });

    let quizDiv = document.getElementById("quizProgram");
    quizDiv.appendChild(sessionCode);
    quizDiv.appendChild(copyButton);
}

//---------------------------------------------------------------------------------------Join Quiz
let joinQuiz = document.getElementById("join_quiz_button");
joinQuiz.addEventListener("click", startQuiz);

//Start the quiz
async function startQuiz(){
    let sessionName = document.getElementById("join_quiz_text").value;
    let sessionNameJSON = {sessionName: sessionName};
    let findSession = await fetchPostQuizData("/api/GetSpecificQuizSession",sessionNameJSON);
    console.log(findSession);
    
    if(!findSession.session){
        errorMessage("No sessions found",joinQuiz);
        return 0;
    }
    hideDivs("quizOutput");
    let quizId = findSession.session.QuizNameId;
    console.log(quizId);
    let div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    let quizIdJSON = {id: quizId};
    let data = await fetchPostQuizData("/api/GetSpecificQuiz",quizIdJSON);
    console.log(data);
    const jsonDisplayDiv = document.getElementById("quiz_output");

    data.quiz.Questions.forEach(question =>{
        let questionField = document.createElement("h3");
        questionField.textContent = question.questionText;
        jsonDisplayDiv.appendChild(questionField);

        question.Answers.forEach((answer, index) => {
            let answerField = document.createElement("input");
            answerField.type = "checkbox";
            answerField.id = `answer_${index}`;
            let label = document.createElement("label");
            label.setAttribute("for", `answer_${index}`);
            label.textContent = answer.answerText;
            jsonDisplayDiv.appendChild(answerField); 
            jsonDisplayDiv.appendChild(label);
            jsonDisplayDiv.appendChild(document.createElement("br")); 
        });
    });                         

    let submitAnswers = document.createElement("button");
    submitAnswers.id = "submitId";
    submitAnswers.type = "submit";
    submitAnswers.textContent = "Submit Answers";
    jsonDisplayDiv.appendChild(submitAnswers);

    submitAnswersButton = document.querySelector("#submitId");
    submitAnswersButton.addEventListener("click", () => {
        checkAnswers(quizId);
    });
}


//---------------------------------------------------------------------------------------Quiz verifying
async function checkAnswers(quizId) {
    let data = await fetchAllQuizData();
    for (const q of data.quiz) {
        if (q.quiz_name === quizId) {
            const answerFeedback = [];
            let str = "";
            str = "#answer_";
            for (let j = 0; j < q.correct_answers.length; j++) {
                // der er fejl her, ved ikke hvad det er
                str = "#answer_" + j;
                if ((q.correct_answers[j] && document.querySelector(str).checked) || (!q.correct_answers[j] && !document.querySelector(str).checked)) {
                    answerFeedback[j] = true;
                } else {
                    answerFeedback[j] = false;
                }
            }
            await sendAnswers(answerFeedback, q.question);
        }
    }
    printFeedback(quizId);
}


async function send_answers(answer_data, question1) {
    let data = await fetchAllQuizData();
    for (const q of data.quiz) {
        if (q.question === question1) {
            q.user_answer = answer_data;
        }
    }
    // const response = await fetch('/database/quiz.json', {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    // });
    // if (!response.ok) {
    //     throw new Error('Failed to send answers. Status: ' + response.status + ' ' + response.statusText);
    // }
    const updatedData = await response.json();
    // console.log(updatedData); // Log the updated data after sending answers
}

async function print_feedback (quiz_id) {
    let quiz_total_answers = 0;
    let quiz_total_corr_answers = 0;
    let feedback_div = document.createElement('div');
    let container = document.querySelector('#quiz_output');
    container.appendChild(feedback_div);

    
    let data = await fetchAllQuizData();
    data.quiz.forEach(q => {
    if (q.quiz_name === quiz_id) {
        let new_divider = document.createElement('div');
        feedback_div.appendChild(new_divider);
        let new_h3 = document.createElement('h3');
        new_h3.textContent = q.question;
        new_divider.appendChild(new_h3);
        let corr_ans = 0;
        question_total_answers = q.answers.length;
        quiz_total_answers += q.answers.length;
        for (let j = 0; j < q.answers.length; j++) {
            let new_answer = document.createElement('p');
            new_answer.textContent = q.answers[j];
            if (q.user_answer[j]) {
                new_answer.style.backgroundColor = "green";
                corr_ans++;
            } else {
                new_answer.style.backgroundColor = "red";
            }
            new_divider.appendChild(new_answer);
        }
        quiz_total_corr_answers += corr_ans;
        new_p_1 = document.createElement('p');
        new_p_1.textContent = corr_ans + " / " + question_total_answers + " answered correct."
        new_divider.appendChild(new_p_1);
    }
    });
    new_p_2 = document.createElement('p');
    new_p_2.textContent = quiz_total_corr_answers + " / " + quiz_total_answers + " total answered correct."
    feedback_div.appendChild(new_p_2);
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

