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
async function fetchQuizData() {
    try {
      const response = await fetch('/api/quiz-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      // Use the data to display your quiz
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
}

async function fetchQuizData2() {
    try {
        const response = await fetch("/api/quizzes");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        // Use the data to display your quiz
        return data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null; // Return null or handle the error as needed
    }
}
let knap = document.getElementById("quiz_home_screen");
knap.addEventListener("click", function() {
    fetchQuizData2().then(data => {
        // Here you can use the retrieved data to display your quiz
        if (data) {
            // Display the quiz using the data
            console.log("Quiz data:", data);
        } else {
            // Handle the case where data is null (error occurred)
            console.log("Failed to fetch quiz data");
        }
    });    
});


//Check if the quiz name already exist
async function IsQuizNameUnique(name){
    let result = false;
    let data = await fetchQuizData();
    data.quiz.forEach(q => {
        if(q.quiz_name === name){
            result = true;
        } 
    });
    return result;
}

//---------------------------------------------------------------------------------------Home page
//Home button
let createQuizDiv = document.getElementById("creat_quiz_div");
let homeScreenButton = document.getElementById("quiz_home_screen");
let homeScreenDiv = document.getElementById("quiz_index");

homeScreenButton.addEventListener("click", () => {
    homeScreenDiv.style.display = "block";

    createQuizDiv.style.display = "none";
});

//---------------------------------------------------------------------------------------Create quiz

let creat_quiz = document.getElementById("create_quiz_button");
creat_quiz.addEventListener("click", async() => {
    let name = document.getElementById("create_quiz_text").value;
    if(await IsQuizNameUnique(name)){
        errorMessage("Already created",creat_quiz);
    } else {
        createQuizDiv.style.display ="block";
        homeScreenDiv.style.display = "none";

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
    // clear_questions();
}


//Create a question and insert the data into the quiz.JSON file
// const upload_quiz_buttons = document.getElementById("upload_quiz_button");
// upload_quiz_buttons.addEventListener("click", () => {
//     //Check if the quiz name is inserted
//     let quiz_name = document.getElementById("quiz_name").textContent;
    
//     //Get the value from the question input field
//     let question = document.getElementById("question_txt_field").value;
//     let answers_list = [];
//     let correct_answers_list = [];
    
//     //For loop for each answered inserted
//     for(let i = 0; i < current_answers_number; i++){
//         //Get the value from the specific answer input
//         let current_answer_text = document.getElementById("answer"+i).value;
//         //Check if the user has inserted any data or if its empty
//         if(current_answer_text !== ""){
//             //If there is a input it check if the answer is correct or false.
//             let current_answer_checkbox = document.getElementById("checkbox"+i).checked;
//             //push the answer and its correctness to the array which is used to insert it to a JSON file.
//             answers_list.push(current_answer_text);
//             correct_answers_list.push(current_answer_checkbox);
//         }
//     }
//     // Create an object with the data
//     const data = {
//         quiz_name: quiz_name,
//         question: question,
//         answers: answers_list,
//         correct_answers: correct_answers_list
//     };
      
//     // Send the data to the server-side script
//     fetch('/upload_quiz_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Data has been successfully saved:', data);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
//     //Clear questions and their answers after creating a question.
//     clear_questions();
// });

// //Clear questions and their answers after creating a question.
// function clear_questions(){
//     //Get all the elements with the class answer_container
//     let input_divs = document.querySelectorAll(".answer_container");

//     //Iterate trough the answer exept the first because a new answer should be able to be written
//     for (let i = 1; i < input_divs.length; i++){
//         //Remove the element from the document.
//         input_divs[i].remove();
//     }  

//     //Remove the text from the question and answers
//     document.getElementById("answer0").value = "";
//     document.getElementById("question_txt_field").value = "";

//     // generate the eventlistener so everything its back a when its runned at first
//     last_answer_input.addEventListener("input", create_new_answer_box);

// }

//---------------------------------------------------------------------------------------Search quizzes


let search_quiz_input = document.getElementById("search_quiz_text");
search_quiz_input.addEventListener("input",() => {
    search_quizzes();
});

//Find all unique quizzes
async function search_quizzes(){
    let data = await fetchQuizData();
    data = data.quiz;
    // Use a Set to store unique quiz_names
    const uniqueQuizNames = new Set();

    // Filter out objects with duplicate quiz_names
    const uniqueQuizData = data.filter(item => {
        if (!uniqueQuizNames.has(item.quiz_name)) {
            uniqueQuizNames.add(item.quiz_name);
            return true;
        }
        return false;
    });
    let new_quizzes_searched = new Set();
    
    let search = document.getElementById("search_quiz_text").value;

    if(search !== ""){
        uniqueQuizData.forEach(q => {
            if(q.quiz_name.toLowerCase().includes(search.toLowerCase())){
                new_quizzes_searched.add(q.quiz_name);
            }
        });
    } else {
        new_quizzes_searched = uniqueQuizNames;
    }
   
    let table = document.getElementById("search_quiz_table");
    //reset the table
    table.textContent = "";
    new_quizzes_searched.forEach(quiz => {
        let row = document.createElement("tr");

        let quiz_name = document.createElement("td");
        quiz_name.textContent = quiz;
        row.appendChild(quiz_name);

        let start_quiz_button = document.createElement("button");
        start_quiz_button.textContent = "Start Quiz";
        start_quiz_button.className = "start_quiz_button";
        start_quiz_button.addEventListener("click", () => {
            start_quiz(quiz);
        });
        row.appendChild(start_quiz_button);

        table.appendChild(row);
    });
}
search_quizzes();

//---------------------------------------------------------------------------------------Start quiz


//Start the quiz
function start_quiz(quiz_id){
    
    let div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    fetchQuizData()
    .then(data => {

        // let quiz_id = document.getElementById("quiz_name_output").textContent;

        const jsonDisplayDiv = document.getElementById("quiz_output");
        data.quiz.forEach(q => {
            if(q.quiz_name === quiz_id){      
                let question_field = document.createElement("h3");
                question_field.textContent = q.question;
                jsonDisplayDiv.appendChild(question_field);
        
                q.answers.forEach((answer, index) => {
                    let answer_field = document.createElement("input");
                    answer_field.type = "checkbox";
                    answer_field.id = `answer_${index}`;
                    let label = document.createElement("label");
                    label.setAttribute("for", `answer_${index}`);
                    label.textContent = answer;
                    jsonDisplayDiv.appendChild(answer_field); 
                    jsonDisplayDiv.appendChild(label);
                    jsonDisplayDiv.appendChild(document.createElement("br")); 
                });
            }                               
        });

        let submit_answers = document.createElement("button");
        submit_answers.id = "submit_id";
        submit_answers.type = "submit";
        submit_answers.textContent = "Submit Answers";
        jsonDisplayDiv.appendChild(submit_answers);

        submit_answers_button = document.querySelector("#submit_id");
            submit_answers_button.addEventListener("click", () => {
            check_answers(quiz_id);
        });
    });
}

//---------------------------------------------------------------------------------------Quiz verifying


async function check_answers(quiz_id) {
    let data = await fetchQuizData();
    for (const q of data.quiz) {
        if (q.quiz_name === quiz_id) {
            const answer_feedback = [];
            let str = "";
            str = "#answer_";
            for (let j = 0; j < q.correct_answers.length; j++) {
                // der er fejl her, ved ikke hvad det er
                str = "#answer_" + j;
                if ((q.correct_answers[j] && document.querySelector(str).checked) || (!q.correct_answers[j] && !document.querySelector(str).checked)) {
                    answer_feedback[j] = true;
                } else {
                    answer_feedback[j] = false;
                }
            }
            await send_answers(answer_feedback, q.question);
        }
    }
    print_feedback(quiz_id);

} 

async function send_answers(answer_data, question1) {
    let data = await fetchQuizData();
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

    
    let data = await fetchQuizData();
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

