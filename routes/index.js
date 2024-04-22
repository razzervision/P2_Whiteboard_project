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
        console.log(req.body);
        const { quizName, questionList, answersList, correctAnswersList } = req.body;

        // Create the quiz
        const createdQuiz = await Quiz.QuizName.create({ quizName: quizName });

        for (let i = 0; i < questionList.length; i++) {
            const question = questionList[i];
            const createdQuestion = await Quiz.Question.create({
                questionText: question,
                QuizNameId: createdQuiz.id
            });

            // Create answers and associate them with the question
            const answerPromises = answersList[i].map(async (answerText, answerIndex) => {
                return Quiz.Answer.create({
                    answerText: answerText,
                    isCorrect: correctAnswersList[i][answerIndex],
                    QuestionId: createdQuestion.id
                });
            });

            await Promise.all(answerPromises);
        }

        res.status(201).json({ quiz: createdQuiz });
    } catch (error) {
        console.error("Error creating quiz", error);
        res.status(400).send("Error creating quiz");
    }
});

router.get("/api/quizzes", async (req, res) => {
    console.log("WOW"); 
    try {
        // Fetch all quizzes with their associated questions and answers
        const quizzes = await Quiz.QuizName.findAll({
            include: [
                {
                    model: Quiz.Question,
                    include: Quiz.Answer
                }
            ]
        });
        res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error fetching quizzes", error);
        res.status(500).send("Error fetching quizzes");
    }
});



module.exports = router;
