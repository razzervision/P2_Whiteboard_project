let quiz_questions = [];
let quiz_answers = [];
let user_answer = [];
let answer_fields_generated = 0;
const question_txt_field = document.getElementById('question_txt_field');
const answer_txt_field = document.getElementById('correct_answer');
const quiz_txt_area = document.getElementById('quiz_txt_area');
const answer0_txt_field = document.getElementById('answer0');


let answer1_txt_field;
let answer2_txt_field;
let answer3_txt_field; 
let answer4_txt_field;
let answer5_txt_field;

let question_number_createQA = 0;

const create_QAs_button = document.getElementById('create_QAs');
const start_quiz_button = document.getElementById('start_quiz');



function create_new_answer_box(){
    let id = document.getElementById("create_new_answer");
    id = id.previousElementSibling.id;
    id = parseInt(id[6]);
    if(id < 5){
        let str = "answer" + id;
        let answer_label = document.createElement("label");
        let answer_text = document.createElement("input");
        
        id++;
    
        answer_label.innerHTML = "Answer "+ id + ":";
        answer_label.id = "answer"+ id + "_label";
        answer_label.class="answer_label_class";
        answer_label.setAttribute("for", "answer"+ id);
        
        answer_text.type="text";
        answer_text.id = "answer"+id;
        answer_text.classList.add("answer_text_class");
    
        let button = document.getElementById("create_new_answer");
        
        button.parentNode.insertBefore(answer_label, button);
        button.parentNode.insertBefore(answer_text, button);
        
    } else {
        alert("Max 5 answers");
        console.log("FAIL");
    }

    answer1_txt_field = document.getElementById('answer1');
    answer2_txt_field = document.getElementById('answer2');
    answer3_txt_field = document.getElementById('answer3');
    answer4_txt_field = document.getElementById('answer4');
    answer5_txt_field = document.getElementById('answer5');
    answer_fields_generated = id;
}

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
    var temp_divider;
    const container = document.getElementById('radioChoices');
    var newDivider = document.createElement('div');
    let i = 0;
    quiz_answers.forEach(question => {
        newDivider.id = 'divider' + (i + 1);
        container.appendChild(newDivider);
        add_question(i);
        add_radio(i);
        i++;
    });
});

function add_question(question) {
    temp_divider = document.getElementById('divider' + (question + 1));
    question += 1;
    var pElement = document.createElement('p');
    pElement.textContent = "Question " + question + ":"
    temp_divider.appendChild(pElement);
    //container.appendChild(pElement);
} 

// var divider = document.getElementById('divider');
// if (divider) {
//     divider.parentNode.removeChild(divider);
// }

function add_radio(question) {
    temp_divider = document.getElementById('divider' + (question + 1));
    quiz_answers[question].forEach(choice => {    
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'choice';
        radio.value = choice;
        
        const label = document.createElement('label');
        label.textContent = choice;

        temp_divider.appendChild(radio);
        temp_divider.appendChild(label);

        temp_divider.appendChild(document.createElement('br'));
        
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
    let str = "answer(s): ";
    for (let i = 0; i < quiz_questions.length; i++) {
        console.log("question: " + quiz_questions[i] + "\n");
        
        for (let j = 0; j < quiz_answers[i].length; j++) {
            str += quiz_answers[i][j] + ", ";
        }
        console.log(str);
        str = "";
    }
    var i = 0;
    quiz_questions.forEach(radio_box => {
        temp_divider = document.getElementById('divider' + i);
    });

}

function clearQAs() {
    quiz_questions = [];
    quiz_answers = [];
}