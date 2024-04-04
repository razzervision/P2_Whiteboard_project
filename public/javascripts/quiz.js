//Maximum answer the user can insert. 
const max_answers = 5;

//Count how many answers there is
let current_answers_number = 1;

//Generate a new answers input when typing on the first answer text input. 
let last_answer_input = document.getElementById("answer0");
last_answer_input.addEventListener("input", create_new_answer_box);


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
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
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
    let quiz_name = document.getElementById("quiz_name").value;
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


//Start the quiz
let start_quiz = document.getElementById("start_quiz");

start_quiz.addEventListener("click", () => {

    fetch_data("/database/quiz.json")
    .then(data => {
        console.log(data);

        let quiz_id = document.getElementById("quiz_name").value;

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
});

function check_answers (question) {
    let answer_feedback = [];

    let str = "";
    let i = 0;
    fetch('/database/quiz.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })

        .then(data => {
            data.quiz.forEach(q => {
                if (q.quiz_name === question) {
                    answer_feedback.push([]);
                    str = "#answer_";
                    for (let j = 0; j < q.correct_answers.length; j++) {
                        str = "#answer_" + j;
                        // console.log(str);
                        // console.log(q.answers[j]);
                        // console.log(q.correct_answers[j]);
                        if ((q.correct_answers[j] && document.querySelector(str).checked) || (!(q.correct_answers[j]) && (!(document.querySelector(str).checked))) ) {
                            answer_feedback[i][j] = true;
                        } else {
                            answer_feedback[i][j] = false;
                        }

                };
                };
                i++;
                console.log(answer_feedback);
            });
            console.log(answer_feedback);

            data.quiz.forEach(q => {   

            });
        });
};

//Remove all content of output div.
let remove_quiz_button = document.getElementById("end_quiz");
remove_quiz_button.addEventListener("click", () => {
    remove_quiz_output();
});
function remove_quiz_output(){
    let quiz = document.getElementById("quiz_output");
    while(quiz.firstChild) { 
        quiz.removeChild(quiz.firstChild); 
    } 
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
// autofill();