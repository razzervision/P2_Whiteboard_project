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
router.post("/resetAllQuizData", async (req, res) => {    
    try {
        const {key} = req.body;
        if(key === "Delete"){
            // Reset all tables
            await Quiz.QuizName.drop();
            await Quiz.Question.drop();
            await Quiz.Answer.drop();
            await Quiz.UserAnswer.drop();
            await Quiz.Session.drop();
            res.status(201).json({ data: "Succesfully deleted" });
        } else {
            res.status(201).json({data: "Wrong Key"});
        }
        
    } catch (error) {
        console.error("Error creating quiz", error);
        res.status(400).send("Error creating quiz");
    }
});


router.post("/uploadQuiz", async (req, res) => {
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

router.get("/api/Getquizzes", async (req, res) => {
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


router.get("/api/GetQuizSessions", async (req, res) => {
    try {
        // Fetch all quizzes with their associated questions and answers
        const lastQuizSession = await Quiz.Session.findOne({
            order: [['id', 'DESC']] // Order by ID in descending order to get the highest ID
        });             
        
        res.status(200).json({ lastQuizSession });
    } catch (error) {
        console.error("Error fetching quizzes", error);
        res.status(500).send("Error fetching quizzes");
    }
});
router.post("/api/GetSpecificQuiz", async (req, res) => {
    const quizId = req.body;
    try {
        // Fetch one quiz with quiz id
        const quiz = await Quiz.QuizName.findOne({
            where: { id: quizId.id }, 
            include: [
                {
                    model: Quiz.Question,
                    include: Quiz.Answer
                }
            ]
        });
        res.status(200).json({ quiz });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});


router.post("/api/startQuizSession", async (req, res) => {
    const JSON = req.body;
    console.log(JSON);
    try {
        const session = await Quiz.Session.create({ 
            sessionName: JSON.sessionName,
            sessionOpen: true,
            QuizNameId: JSON.quizId 
        });
        res.status(200).json({ session });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});


router.post("/api/GetSpecificQuizSession", async (req, res) => {
    const sessionName = req.body;
    try {
        // Fetch one quiz with quiz id
        const session = await Quiz.Session.findOne({
            where: { sessionName: sessionName.sessionName }
        });
        res.status(200).json({ session });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});


router.post("/api/insertQuizUserData", async (req, res) => {
    try {
        const { session, userId, isCorrect } = req.body;
        // Fetch one quiz with quiz id
        const quizData = await Quiz.Session.findOne({
            where: { 
                sessionName: session,
                sessionOpen: true
            },
            include: [
                {
                    model: Quiz.QuizName,
                    include: [
                        {
                            model: Quiz.Question,
                            include: Quiz.Answer 
                        }
                    ]
                }
            ]
        });
        
        for (let questionIndex = 0; questionIndex < quizData.QuizName.Questions.length; questionIndex++) {
            const question = quizData.QuizName.Questions[questionIndex];
            // Loop through answers
            for (let answerIndex = 0; answerIndex < question.Answers.length; answerIndex++) {
                const answer = question.Answers[answerIndex];
                // Use await within an async function
                const userData = await Quiz.UserAnswer.create({
                    userId: userId,
                    isCorrect: isCorrect[questionIndex][answerIndex],
                    AnswerId: answer.id,
                    SessionId: quizData.dataValues.id
                });
            }
        }

        res.status(200).json({ quizData });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});


router.post("/api/userResponsData", async (req, res) => {
    try {
        const { session } = req.body;
        // Fetch one quiz with quiz id
        const quizData = await Quiz.Session.findOne({
            where: { 
                sessionName: session,
                sessionOpen: true
            },
            include: [
                {
                    model: Quiz.QuizName,
                    include: [
                        {
                            model: Quiz.Question,
                            include: Quiz.Answer 
                        }
                    ]
                }, 
                {
                    model: Quiz.UserAnswer, 
                    where: {
                        sessionId: sequelize.col("Session.id")
                    }
                }
            ]
        });
        
        
        res.status(200).json({ quizData });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});

router.post("/api/findQuestionScore", async (req, res) => {
    try {
        const { session, questionId } = req.body;
        console.log(questionId,session);
        const answers = await Quiz.UserAnswer.findAll({
            where: {
                SessionId: session
            },
            include: [
                {
                    model: Quiz.Answer,
                    where: {
                        QuestionId: questionId
                    },
                    required: true,
                    include: [
                    ]
                }
            ]
        });
        
        
        res.status(200).json({ answers });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});

router.post("/api/checkIfSessionIsOpened", async (req, res) => {
    try {
        const { sessionName } = req.body;
        const isSession = await Quiz.Session.findOne({
            where: {
                sessionName: sessionName
            }
        });
        
        res.status(200).json({ isSession });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});


router.post("/api/endSession", async (req, res) => {
    try {
        const { sessionName } = req.body;
        const session = await Quiz.Session.findOne({
            where: {
                sessionName: sessionName
            }
        });

        await session.update({ sessionOpen: false });
        
        res.status(200).json({ session });
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(500).send("Error fetching quiz");
    }
});



module.exports = router;
