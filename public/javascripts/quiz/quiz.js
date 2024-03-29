//Maximum answer the user can insert. 
const max_answers = 5;

//Count how many answers there is
let current_answers_number = 1;

//Generate a new answers input when typing on the first answer text input. 
let last_answer_input = document.getElementById("answer0");
last_answer_input.addEventListener("input", create_new_answer_box);

let quiz_answers_data = [];

//Helping funktions

//Check if the element is created
function is_id_created(id){
    let element = document.getElementById(id);
    if (element) {
        return true;
    } else {
        return false;
    }
}

function error_message(message){
    //Check if there already is a fail message
    if(is_id_created("error_message")){
        document.getElementById("error_message").remove();
    }

    //Generate a error message for the user.
    let error = document.createElement("h4");
    error.id = "error_message";
    error.textContent = message;
    error.style.color = "red";

    //Identify the element after answer inputs. 
    let button = document.getElementById("create_new_answer");
    button.parentNode.insertBefore(error, button);
}


//Funktion for fetch_data
function fetch_data(path){
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
}



let creat_quiz = document.getElementById("create_quiz_button");
creat_quiz.addEventListener("click", async() => {
    let name = document.getElementById("create_quiz_text").value;
    if(await quiz_name_already_created(name)){
        console.log("Already created");
    } else {
        let create_quiz_div = document.getElementById("creat_quiz_div");
        create_quiz_div.style.display ="block";

        let start_page = document.getElementById("quiz_index");
        start_page.style.display = "none";

        let quiz_name = document.getElementById("quiz_name");
        quiz_name.textContent = name; 
    }
});



//Check if the quiz name already exist
async function quiz_name_already_created(name){
    let result = false;

    let data = await fetch_data("../database/quiz.json");
    data.quiz.forEach(q => {
        if(q.quiz_name === name){
            result = true;
        } 
    });
    console.log(result);
    return result;
}

//This function create a new answer box to let the user dynamically add more answers.
function create_new_answer_box(){

    //Stop the funktion if too many answer inputs
    if(is_id_created("error_too_many_answer_inputs")){
        return 0;
    }
    //Define the last created answer by taking the element afterward and use previousElementSibling to get the element before that
    let previous_element = document.getElementById("create_new_answer").previousElementSibling;
    previous_element = previous_element.querySelector(".answer_checkbox_class");
    
    //Takes the last part of the ID. e.g "checkbox0" where the 8 element is the last which is the ID.
    let id = parseInt(previous_element.id[8]);
    //Ensure there is a limit of answers. 
    if(id < max_answers){

        //Increase the ID with one to make the ID unique.
        id++;
        
        //Create all the elements needed for an extra answers
        let question_box = document.createElement("div");
        question_box.className="answer_container";
        question_box.id="answer_container"+id;

        //Label for answers
        let answer_label = document.createElement("label");
        answer_label.textContent = "Answer "+ id + ":";
        answer_label.id = "answer"+ id + "_label";
        answer_label.className="answer_label_class";
        answer_label.setAttribute("for", "answer"+ id);
        question_box.appendChild(answer_label);

        //Answer input
        let answer_text = document.createElement("input");
        answer_text.type="text";
        answer_text.id = "answer"+id;
        answer_text.className="answer_text_class";
        question_box.appendChild(answer_text);

        //Correct answer checkbox
        let answer_checkbox = document.createElement("input");
        answer_checkbox.type="checkbox";
        answer_checkbox.id = "checkbox"+id;
        answer_checkbox.className = "answer_checkbox_class";
        question_box.appendChild(answer_checkbox);

        //Identify the element after answer inputs. 
        let button = document.getElementById("create_new_answer");
        
        //Insert them before the add new answer button to make the flow intuitive. 
        button.parentNode.insertBefore(question_box, button);

        //Remove the EventListener because the new answer is created
        let old_id = id - 1;
        last_answer_input = document.getElementById("answer"+old_id);
        last_answer_input.removeEventListener("input", create_new_answer_box);

        //Generate a EventListener for the new answer text input. 
        answer_text.addEventListener("input", create_new_answer_box);

        //Increase current quizzes
        current_answers_number++;
    } else {
        //If theres is too many answers make an error message.
        error_message("You can max insert" + max_answers + "answers");
    }
}

//Create a question and insert the data into the quiz.JSON file
const create_QAs_button = document.getElementById("create_QAs");
create_QAs_button.addEventListener("click", () => {
    //Check if the quiz name is inserted
    let quiz_name = document.getElementById("quiz_name").textContent;
    if(quiz_name === ""){
        //Generate a error message for the user.
        error_message("Please insert a quiz name, and don't change it");
        // Return to exit the funktion
        return 0;
    } else {
        //Ensure that if their already is a error message it disappear.
        if(is_id_created("error_message")){
            document.getElementById("error_message").remove();
        }
    }

    //Get the value from the question input field
    let question = document.getElementById("question_txt_field").value;
    let answers_list = [];
    let correct_answers_list = [];
    
    //For loop for each answered inserted
    for(let i = 0; i < current_answers_number; i++){
        //Get the value from the specific answer input
        let current_answer_text = document.getElementById("answer"+i).value;
        //Check if the user has inserted any data or if its empty
        if(current_answer_text !== ""){
            //If there is a input it check if the answer is correct or false.
            let current_answer_checkbox = document.getElementById("checkbox"+i).checked;
            //push the answer and its correctness to the array which is used to insert it to a JSON file.
            answers_list.push(current_answer_text);
            correct_answers_list.push(current_answer_checkbox);
        }
    }
    // Create an object with the data
    const data = {
        quiz_name: quiz_name,
        question: question,
        answers: answers_list,
        correct_answers: correct_answers_list,
        user_answer: []
    };
      
    // Send the data to the server-side script
    fetch('/upload_quiz_data', {
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
});

//Clear questions and their answers after creating a question.
function clear_questions(){
    //Get all the elements with the class answer_container
    let input_divs = document.querySelectorAll(".answer_container");

    //Iterate trough the answer exept the first because a new answer should be able to be written
    for (let i = 1; i < input_divs.length; i++){
        //Remove the element from the document.
        input_divs[i].remove();
    }
    //After the element is removed there is only 1 answer option
    current_answers_number = 1;   

    //Remove the text from the question and answers
    document.getElementById("answer0").value = "";
    document.getElementById("question_txt_field").value = "";

    // generate the eventlistener so everything its back a when its runned at first
    last_answer_input.addEventListener("input", create_new_answer_box);

}
let search_quiz_input = document.getElementById("search_quiz_text");
search_quiz_input.addEventListener("input",() => {
    search_quizzes();
});

//Find all unique quizzes
async function search_quizzes(){
    let data = await fetch_data("../database/quiz.json");
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

//Start the quiz
function start_quiz(quiz_id){
    
    let div = document.getElementById("quiz_output");
    div.style.display = "block";
    div.textContent = "";
    fetch_data("../database/quiz.json")
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

async function check_answers(quiz_id) {
    try {
        const response = await fetch('../database/quiz.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
    } catch (error) {
        console.error('Error:', error);
    }
    print_feedback(quiz_id);
}

async function send_answers(answer_data, question1) {
    try {
        const dataResponse = await fetch("../database/quiz.json");
        const data = await dataResponse.json();
        for (const q of data.quiz) {
            if (q.question === question1) {
                q.user_answer = answer_data;
            }
        }
        const response = await fetch('../database/quiz.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to send answers. Status: ' + response.status + ' ' + response.statusText);
        }
        const updatedData = await response.json();
        console.log(updatedData); // Log the updated data after sending answers
    } catch (error) {
        console.error('Error:', error);
    }
}

function print_feedback (quiz_id) {
    let quiz_total_answers = 0;
    let quiz_total_corr_answers = 0;
    let feedback_div = document.createElement('div');
    let container = document.querySelector('#quiz_output');
    container.appendChild(feedback_div);

    fetch("../database/quiz.json")
    //fetch_data("../database/quiz.json");
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
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
    })
    .catch(error => {
        console.error('There was a problem fetching the JSON file:', error);
    });
}

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
autofill();