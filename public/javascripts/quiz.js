//Maximum answer the user can insert. 
const max_answers = 5;

//Generate a new answers input when typing on the first answer text input. 
let last_answer_input = document.getElementById("answer0");
last_answer_input.addEventListener('input', create_new_answer_box);

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
    
        //Identify 
        let button = document.getElementById("create_new_answer");
        
        button.parentNode.insertBefore(answer_label, button);
        button.parentNode.insertBefore(answer_text, button);
        button.parentNode.insertBefore(answer_checkbox, button);

        last_answer_input.removeEventListener('input', create_new_answer_box);

        last_answer_input = document.getElementById("create_new_answer").previousElementSibling.previousElementSibling;

        last_answer_input.addEventListener('input', create_new_answer_box);

    } else {
        // alert("Max 5 answers");
        console.log("FAIL");
    }

    answer_fields_generated = id;
}


let quiz_questions = [];
let quiz_answers = [];
let user_answer = [];
let answer_fields_generated = 0;
const question_txt_field = document.getElementById('question_txt_field');
const answer_txt_field = document.getElementById('correct_answer');
const quiz_txt_area = document.getElementById('quiz_txt_area');
const answer0_txt_field = document.getElementById('answer0');

var new_divider = document.createElement('div');

let question_number_createQA = 0;

const create_QAs_button = document.getElementById('create_QAs');
const start_quiz_button = document.getElementById('start_quiz');

create_QAs_button.addEventListener('click', () => {
    if (question_txt_field.value && answer_txt_field.value) {
        create_quiz_q_a();
    } else {
        console.log('Please enter both a question and answer.');
    }

    question_txt_field.value = "";
    answer_txt_field.value = "";
    answer0_txt_field.value = "";
    if (answer_fields_generated == 1) {
        answer1_txt_field.value = "";
    }
    if (answer_fields_generated == 2) {
        answer1_txt_field.value = "";
        answer2_txt_field.value = "";
    }
    if (answer_fields_generated == 3) {
        answer1_txt_field.value = "";
        answer2_txt_field.value = "";
        answer3_txt_field.value = "";
    }
    if (answer_fields_generated == 4) {
        answer1_txt_field.value = "";
        answer2_txt_field.value = "";
        answer3_txt_field.value = "";
        answer4_txt_field.value = "";
    }
    if (answer_fields_generated == 5) {
        answer5_txt_field.value = "";
        answer1_txt_field.value = "";
        answer2_txt_field.value = "";
        answer3_txt_field.value = "";
        answer4_txt_field.value = "";
    }

});

function clear_fields() {
    // tilføj funktion der laver alle felters .value om til = "";
    // eller måske bare specifikke felter, måske dem der er blevet genereret, eller dem der allerede har value i sig
}



function create_quiz_q_a() {
    quiz_questions.push(question_txt_field.value);
    quiz_answers.push([]);
    quiz_answers[question_number_createQA].push(answer_txt_field.value);

    if (answer0_txt_field.value) {
        quiz_answers[question_number_createQA].push(answer0_txt_field.value);
    }
    if (answer_fields_generated == 1) {
        if (answer1_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer1_txt_field.value);
        }
    }
    if (answer_fields_generated == 2) {
        if (answer1_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer1_txt_field.value);
        }
        if (answer2_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer2_txt_field.value);
        }
    }
    if (answer_fields_generated == 3) {
        if (answer1_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer1_txt_field.value);
        }
        if (answer2_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer2_txt_field.value);
        }
        if (answer3_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer3_txt_field.value);
        }
    }
    if (answer_fields_generated == 4) {
        if (answer1_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer1_txt_field.value);
        }
        if (answer2_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer2_txt_field.value);
        }
        if (answer3_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer3_txt_field.value);
        }
        if (answer4_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer4_txt_field.value);
        }
    }
    if (answer_fields_generated == 5) {
        if (answer1_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer1_txt_field.value);
        }
        if (answer2_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer2_txt_field.value);
        }
        if (answer3_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer3_txt_field.value);
        }
        if (answer4_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer4_txt_field.value);
        }
        if (answer5_txt_field.value) {
            quiz_answers[question_number_createQA].push(answer5_txt_field.value);
        }
    }
    question_number_createQA++;
}

start_quiz_button.addEventListener('click', () => {
    end_quiz();
    const container = document.getElementById('radioChoices');
    new_divider.id = 'r_quiz_divider_id';
    container.appendChild(new_divider);
    for (let i = 0; i < quiz_questions.length; i++) {
        add_question(i);
        add_radio(i);
    }
    i = 0;
});

function add_question(question) {
    new_divider_ref = document.querySelector('#r_quiz_divider_id');
    var pElement = document.createElement('p');
    pElement.textContent = quiz_questions[question] + "?";
    new_divider_ref.appendChild(pElement);
} 

function add_radio(question) {
    new_divider_ref = document.querySelector('#r_quiz_divider_id');
    quiz_answers[question].forEach(choice => {    
        const radio = document.createElement('input');
        radio.type = 'checkbox'; // change to radio if radio buttons are wanted
        radio.name = 'choice';
        radio.value = choice;
        
        const label = document.createElement('label');
        label.textContent = choice;

        new_divider_ref.appendChild(radio);
        new_divider_ref.appendChild(label);

        new_divider_ref.appendChild(document.createElement('br'));
    });
}

function check_correct_answer(question_number) {
    if (user_answer == quiz_answers[question_number][0]) {
        user_answer[question_number] = true;
    } else {
        user_answer[question_number] = false;
    }
}

function end_quiz() {
    new_divider_ref = document.querySelector('#r_quiz_divider_id');
    if (new_divider_ref){
        new_divider_ref.textContent = "";
        new_divider_ref.parentNode.removeChild(new_divider_ref);
    }
}

function clearQAs() {
    quiz_questions = [];
    quiz_answers = [];
}