const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const fs = require("fs");
const sequelize = require("./database/database");
const app = express();


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);

app.get("/api/quizzes2",(req,res) => {
    console.log("hej");
});


//return the json file to the client.
app.get("/api/quiz-data", (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, "/database/quiz.json"), "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        res.status(500).send("Internal Server Error");
    }
});


//Upload quiz data into the database
app.post("/upload_quiz_data", (req, res) => {
    // Access the data sent from the client /the new question
    const newQuestion = req.body;

    // Append quiz data to the current JSON file
    fs.readFile("database/quiz.json", "utf8", (err, data) => {
        let questionsData = [];
        //Get the current data
        questionsData = JSON.parse(data);
        //Insert the current/old questions
        questionsData.quiz.push(newQuestion);

        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(questionsData, null, 4); // 2 is for indentation for readability

        // Write the updated JSON back to the file
        fs.writeFile("database/quiz.json", updatedJSON, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return;
            }
            console.log("Question appended successfully.");
        });
    });
});

app.put("/database/quiz.json", (req, res) => {
    // Access the updated quiz data sent from the client
    const updatedQuizData = req.body;
    //console.log(quiz_answers_data);

    // Write the updated JSON back to the file
    fs.writeFile("database/quiz.json", JSON.stringify(updatedQuizData, null, 4), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            res.status(500).send("Error writing to file");
            return;
        }
        console.log("Quiz data updated successfully.");
        res.json({ message: "Quiz data updated successfully." });
    });
});

// catch 404 and forward to error handlerclear
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Sync the database
sequelize.sync().then(() => {
    console.log("Database synced successfully.");
}).catch((error) => {
    console.error("Error syncing database:", error);
});


module.exports = app;

