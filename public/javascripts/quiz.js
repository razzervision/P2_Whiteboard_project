

//Maximum answer the user can insert. 
const max_answers = 5;

let quiz_started = false;

//Count how many answers there is
let current_answers_number = 1;

//Generate a new answers input when typing on the first answer text input. 
let last_answer_input = document.getElementById("answer0");
last_answer_input.addEventListener("input", create_new_answer_box);


//This function create a new answer box to let the user dynamically add more answers.
function create_new_answer_box(){

    //Define the last created answer by taking the element afterward and use previousElementSibling to get the element before that
    let id = document.getElementById("create_new_answer");
    id = id.previousElementSibling.id;
    //Takes the last part of the ID. e.g "checkbox0" where the 8 element is the last which is the ID.
    id = parseInt(id[8]);

    //Ensure there is a limit of answers. 
    if(id < max_answers){
        //Create all the elements needed for an extra answers
        let answer_label = document.createElement("label");
        let answer_text = document.createElement("input");
        let answer_checkbox = document.createElement("input");

        //Increase the ID with one to make the ID unique.
        id++;

        //Label for answers
        answer_label.textContent = "Answer "+ id + ":";
        answer_label.id = "answer"+ id + "_label";
        answer_label.class="answer_label_class";
        answer_label.setAttribute("for", "answer"+ id);

        //Answer input
        answer_text.type="text";
        answer_text.id = "answer"+id;
        answer_text.classList.add("answer_text_class");

        //Correct answer checkbox
        answer_checkbox.type="checkbox";
        answer_checkbox.id = "checkbox"+id;
        answer_checkbox.classList.add("answer_checkbox_class");
    
        //Identify the element after answer inputs. 
        let button = document.getElementById("create_new_answer");
        
        //Insert them before the add new answer button to make the flow intuitive. 
        button.parentNode.insertBefore(answer_label, button);
        button.parentNode.insertBefore(answer_text, button);
        button.parentNode.insertBefore(answer_checkbox, button);

        //Remove the EventListener because the new answer is created
        last_answer_input.removeEventListener("input", create_new_answer_box);

        //Find the new current latest answer text.
        last_answer_input = document.getElementById("create_new_answer").previousElementSibling.previousElementSibling;

        //Generate a EventListener for the new answer text input. 
        last_answer_input.addEventListener("input", create_new_answer_box);

        //Count current quizzes
        current_answers_number++;
    } else {
        //Generate a error message for the user.
        let error = document.createElement("h4");
        error.id="error_too_many_answer_inputs";
        error.textContent="Max "+ max_answers + " Answers";
        error.style.color="red";

        //Identify the element after answer inputs. 
        let button = document.getElementById("create_new_answer");
        button.parentNode.insertBefore(error, button);

    }
}

const create_QAs_button = document.getElementById("create_QAs");

create_QAs_button.addEventListener("click", () => {
    let quiz_name = document.getElementById("quiz_name").value;
    if(quiz_name === ""){
        //Generate a error message for the user.
        let error = document.createElement("h4");
        error.id="error_no_quiz_name";
        error.textContent="Please insert a quiz name, and don't change it";
        error.style.color="red";

        //Identify the element after answer inputs. 
        let button = document.getElementById("create_new_answer");
        button.parentNode.insertBefore(error, button);
        return 0;
    }

    let question = document.getElementById("question_txt_field").value;
    let answers_list = [];
    let correct_answers_list = [];
    
    for(let i = 0; i < current_answers_number; i++){
        current_answer_text = document.getElementById("answer"+i).value;
        if(current_answer_text !== ""){
            current_answer_checkbox = document.getElementById("checkbox"+i).checked;
            answers_list.push(current_answer_text);
            correct_answers_list.push(current_answer_checkbox);
        }
    }
    // Create an object with the data
    const data = {
        quiz_name: quiz_name,
        question: question,
        answers: answers_list,
        correct_answers: correct_answers_list
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

    clear_questions();
});

//VERY BAD TEMP CODE
function clear_questions(){
    let inputs = document.querySelectorAll("input")
    inputs.forEach(input => {
        if(input.id !== "quiz_name"){
            input.value = null;
        }
    });
}


//Start the quiz
let start_quiz = document.getElementById("start_quiz");
start_quiz.addEventListener("click", () => {
    fetch('/database/quiz.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let quiz_id = document.getElementById("quiz_name").value;

            const jsonDisplayDiv = document.getElementById("quiz_output");
            data.quiz.forEach(q => {
                if(q.quiz_name === quiz_id){      
                    console.log(q.question);          
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

        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
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
                answer_feedback.push([]);
                if (q.quiz_name === question) {
                    str = "#answer_";
                    for (let j = 0; j < q.correct_answers.length; j++) {
                        str = "#answer_" + j;
                        // console.log(str);
                        // console.log(q.answers[j]);
                        // console.log(q.correct_answers[j]);
                        if ((q.correct_answers[j] && document.querySelector(str)) || (!(q.correct_answers[j]) && (!(document.querySelector(str)))) ) {
                            answer_feedback[i][j] = true;
                        } else {
                            answer_feedback[i][j] = false;
                        }
                };
                };
                i++;
            });

            data.quiz.forEach(q => {    

            });
        });
};


