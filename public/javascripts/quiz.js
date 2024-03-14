const fs = require("fs");


//Maximum answer the user can insert. 
const max_answers = 5;

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
    let question = document.getElementById("question_txt_field");
    let answers_list = [];
    let correct_answers_list = [];
    
    let current_answer;


    // Read the contents of the JSON file
    const data = fs.readFileSync("../database/quiz.json");
    // Parse the JSON data into a JavaScript object
    const jsonData = JSON.parse(data);
    
    console.log("Before Adding data",JSON.stringify(jsonData, null, 4));
    
    // Modify the JavaScript object by adding new data
    jsonData.users.push({
        name: "James Den",
        email: "james.den@example.com"
    });
    
    
    // Convert the JavaScript object back into a JSON string
    const jsonString = JSON.stringify(jsonData);
    
    fs.writeFileSync("data.json", jsonString, "utf-8", (err) => {
      if (err) throw err;
      console.log("Data added to file");
    });
    
    const update_data = fs.readFileSync("data.json");
    const updated_jsonData = JSON.parse(update_data);
    console.log("After Adding data",JSON.stringify(updated_jsonData, null, 4));



    for(let i = 0; i < current_answers_number; i++){
        current_answer = document.getElementById("answer"+i).value;
        console.log(current_answer);
    }

});
