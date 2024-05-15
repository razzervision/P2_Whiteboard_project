const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();
const sequelize = require("../database/database");
const Quiz = require("../database/database_quiz");
const Pauses = require("../database/database_pauses.js");
const paint = require("../database/database_paint.js");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Mikkel er cool" });
});

//------------------------------------------------------------------------------------- code editor
router.get("/api/loadLanguages", (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, "../database/languages.json"), "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        res.status(500).send("Internal Server Error");
    }
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
            // Reset pause data
            await Pauses.Pause.drop();
            await Pauses.PauseSession.drop();
            res.status(201).json({ data: "Succesfully deleted" });
        } else {
            res.status(201).json({data: "Wrong Key"});
        }
        
    } catch (error) {
        console.error("Error resetting database", error);
        res.status(400).send("Error resetting database");
    }
});


router.post("/uploadQuiz", async (req, res) => {
    try {
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
        if(!quizzes){
            res.status(200).send(false);
        }
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
            order: [["id", "DESC"]] // Order by ID in descending order to get the highest ID
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
    console.log(JSON.sessionName);
    try {
        const session = await Quiz.Session.create({ 
            sessionName: JSON.sessionName,
            sessionOpen: true,
            QuizNameId: JSON.quizId 
        });
        res.status(200).json(session);
    } catch (error) {
        console.error("Error fetching quiz", error);
        res.status(200).send(false);
    }
});


router.post("/api/GetSpecificQuizSession", async (req, res) => {
    const sessionName = req.body;
    try {
        // Fetch one quiz with quiz id
        const session = await Quiz.Session.findOne({
            where: { sessionName: sessionName.sessionName }
        });
        if(!session){
            res.status(200).send(false);
        }
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
                    include: [ //Overvej slet
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
// --------------------------------------------------------------------------------------------Pauses
router.post("/api/StartPauseSession", async (req, res) =>{
    try {
        
        const { session } = req.body;
        console.log(session, "jon");

        const data = await Pauses.PauseSession.create({
            //session: session,
            session: "TEST",
            isActive: true,
            lastPause: null
        });   
        res.status(200).json(data);
    } catch (error) {
        console.error("Error finding pauseData", error);
        res.status(500).send("Error finding pauseData");
    }
});

router.post("/api/InsertPauseData", async (req, res) => {
    try {
        const { session , websiteActivity, leftWebsite, averageTimeLeftWebsite } = req.body;

        const findSession = await Pauses.PauseSession.findOne({
            where: {
                session: session
            }
        });
        if(!session){
            res.status(200).send(false);
        }

        const data = await Pauses.Pause.create({
            PauseSessionId: findSession.id,
            websiteActivity: websiteActivity,
            leftWebsite: leftWebsite,
            averageTimeLeftWebsite: averageTimeLeftWebsite
        });
        
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error uploading pauseData", error);
        res.status(500).send("Error uploading pauseData");
    }
});
async function startPause(sessionData){
    await Pauses.PauseSession.update(
        { lastPause: new Date() },
        {
            where: {
                id: sessionData.id
            }
        }
    );
    
}

async function doPause(data){
    let averageWebsiteActivity = 0;
    const averagePageLeft = 0;
    let averageTimeLeft = 0;
    const highestData = [data[0], data[1]];

    //TODO Sørg for først at køre loopet efter andet stykke data er kommet med.
    for (let index = data.length - 1; index >= 0; index--) {
        if(data[index].websiteActivity > highestData[0].websiteActivity ){
            highestData[1] = highestData[0];
            highestData[0] = data[index];
        }else if(data[index].websiteActivity > highestData[1].websiteActivity) {
            highestData[1] = data[index];
        }
    }
    console.log("data0", data[0].websiteActivity);
    console.log("data1", data[1].websiteActivity);
    console.log("data2", data[2].websiteActivity);

    console.log("websiteActivity0", highestData[0].websiteActivity);
    console.log("websiteActivity1", highestData[1].websiteActivity);
    averageWebsiteActivity = (highestData[0].websiteActivity + highestData[1].websiteActivity) / 2;
    averageTimeLeft = (highestData[0].averageTimeLeftWebsite + highestData[1].averageTimeLeftWebsite) / 2;
    console.log("averageWebsiteActivity:", averageWebsiteActivity);
    console.log("averageTimeLeft: ", averageTimeLeft);
    // const sessionStarted = data[0].createdAt;
    const twoHours = 2 * 60 * 60 * 1000;
    const halfHour = 30 * 60 * 1000;

    data = data[0];
    const lastPause = data.PauseSession.lastPause;
    const sessionCreated = data.PauseSession.createdAt;

    // Ignore pauses withing half an hour
    // if (!lastPause || lastPause < (halfHour)){
    //     return false;
    // }
    // Ignore that the site is ignores

    if (averageWebsiteActivity === 0){
        console.log("web activity = 0");
        return false;
    }

    // Force a pause after 2 hours
    if(!lastPause && sessionCreated > (twoHours)){
        startPause(data.PauseSession);
        console.log("arbejdet over 2 timer");

        return true;
    } 
    // Check if low activity
    if(averageWebsiteActivity <= 50 || averageTimeLeft >= 45000 * 5){
        startPause(data.PauseSession);
        console.log("lav aktivt, tag en pause ");
        return true;
    }

    return false;
}


const { Op } = require("sequelize");
router.post("/api/checkForPause", async (req, res) => {
    try {
        const { session } = req.body;
        console.log(session);
        const fiveMinutes = 5 * 60 * 1000;
        const fiveMinutesAgo = new Date(Date.now() - fiveMinutes); 

        const data = await Pauses.Pause.findAll({
            include: [{
                model: Pauses.PauseSession,
                where: {
                    session: session
                }
            }],
            where: {
                createdAt: {
                    [Op.gt]: fiveMinutesAgo // Greater than five minutes ago
                }
            }
        });
        if(data.length <= 2){
            console.log("EH");
            res.status(200).send(false);
        } else {
            const holdPause = await doPause(data);
            console.log(holdPause);
            res.status(200).json(data);
        }
        //res.status(200).send(holdPause);
        
    } catch (error) {
        console.error("Error finding pauseData", error);
        res.status(500).send("Error finding pauseData");
    }
});

router.post("/api/pauseSessionExist", async (req, res) => {
    try {
        const { session } = req.body;

        const data = await Pauses.PauseSession.findOne({
            where: {
                session: session
            }
        });
        if(data){
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (error) {
        console.error("Error finding pauseData", error);
        res.status(500).send("Error finding pauseData");
    }
});


// WHITEBOARD---------------------------------------------------------------------------

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/api/postPicture", upload.single("picture"), async (req, res) => {
    try {
        const { xPosition, yPosition, pictureWidth, pictureHeight } = req.body;
        const picture = req.file.buffer;
        console.log(req.body);
        console.log(picture);
        const data = await paint.create({
            xPosition: xPosition,
            yPosition: yPosition,
            pictureWidth: pictureWidth,
            pictureHeight: pictureHeight,
            picture: picture
        });
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error uploading picture", error);
        res.status(500).send("Error uploading picture");
    }
});


router.get("/api/getPicture", async (req, res) => {
    try {
        const data = await paint.findOne({ order: [["id", "DESC"]] });
        res.status(200).json({ 
            xPosition: data.xPosition,
            yPosition: data.yPosition,
            pictureWidth: data.pictureWidth,
            pictureHeight: data.pictureHeight,
            picture: data.picture.toString("base64")
        });
    } catch (error) {
        console.error("Error fetching picture", error);
        res.status(500).send("Error fetching picture");
    }
});
        

module.exports = router;
