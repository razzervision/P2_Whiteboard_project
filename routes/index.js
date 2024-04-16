const express = require("express");
const router = express.Router();
const sequelize = require("../database/database");
const User = require("../database/user");
const Quiz = require("../database/database_quiz");



/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Mikkel er cool" });
});

router.post("/users", (req, res) => {
    User.create(req.body).then((user) => {
        res.status(201).json(user);
    }).catch((error) => {
        console.error(error);
        res.status(400).send("Error creating user");
    });
});

router.get("/:room", function(req, res, next) {
    res.render("index", { room: req.params.room, title: "Together Paint"});
});


//------------------------------------------------------------------------------------- quiz
router.post("/uploadQuiz", async (req, res) => {
    // Reset all tables
    // await Quiz.QuizName.drop();
    // await Quiz.Question.drop();
    // await Quiz.Answer.drop();

    try {
        const { quizName, question, answers, correctAnswers } = req.body;

        // Create the quiz
        const createdQuiz = await Quiz.QuizName.create({ quizName: quizName });

        // Create a single question (assuming question is not an array)
        const createdQuestion = await Quiz.Question.create({ questionText: question });
        await createdQuiz.addQuestion(createdQuestion);

        // Create answers and associate them with the question
        // Create answers and associate them with the question
        answers.forEach(async (answerText, answerIndex) => {
            await Quiz.Answer.create({
                answerText: answerText,
                isCorrect: correctAnswers[answerIndex],
                QuestionId: createdQuestion.id // Associate answer with the question
            });
});


        res.status(201).json({ quiz: createdQuiz, question: createdQuestion });
    } catch (error) {
        console.error(error);
        res.status(400).send("Error creating quiz");
    }
});





module.exports = router;
