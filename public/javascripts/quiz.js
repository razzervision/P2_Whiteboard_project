//Maximum answer the user can insert. 
const max_answers = 5;

//Count how many answers there is
let current_answers_number = 1;

//Generate a new answers input when typing on the first answer text input. 
let last_answer_input = document.getElementById("answer0");
last_answer_input.addEventListener("input", create_new_answer_box);

function is_id_created(id){
    let element = document.getElementById(id);
    if (element) {
        return true;
    } else {
        return false;
    }
}

//This function create a new answer box to let the user dynamically add more answers.
function create_new_answer_box(){
    if(is_id_created("error_too_many_answer_inputs")){
        return 0;
    }
    //Define the last created answer by taking the element afterward and use previousElementSibling to get the element before that
    let id = document.getElementById("create_new_answer").previousElementSibling;
    id = id.querySelector(".answer_checkbox_class").id;
    //Takes the last part of the ID. e.g "checkbox0" where the 8 element is the last which is the ID.
    
    id = parseInt(id[8]);
    //Ensure there is a limit of answers. 
    if(id < max_answers){
        //Create all the elements needed for an extra answers
        let question_box = document.createElement("div");
        question_box.className="answer_container";


        //Increase the ID with one to make the ID unique.
        id++;

    
        //Label for answers
        let answer_label = document.createElement("label");
        answer_label.textContent = "Answer "+ id + ":";
        answer_label.id = "answer"+ id + "_label";
        answer_label.className="answer_label_class";
        answer_label.setAttribute("for", "answer"+ id);
        question_box.appendChild(answer_label);

        //Answer input
        let answer_text = document.createElement("input");
        answer_text.value="Markus";
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
        console.log(input.id[6]);
        if(input.id[6] >= 1){
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
            submit_answers.type = "submit";
            submit_answers.textContent = "Submit Answers";
            jsonDisplayDiv.appendChild(submit_answers);


        })
        .catch(error => {
            console.error('There was a problem fetching the JSON file:', error);
        });
});