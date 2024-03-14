const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const togetherPaintRouter = require("./routes/togetherPaint");
const fs = require('fs');
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
app.use("/togetherPaint", togetherPaintRouter);


// Define route handler for POST requests to "/upload_quiz_data"
app.post("/upload_quiz_data", (req, res) => {
    // Access the data sent from the client
    const newQuestion = req.body;
    console.log(newQuestion);

    // Append quiz data to a JSON file
    fs.readFile("public/database/quiz.json", "utf8", (err, data) => {
        let questionsData = [];
        //Insert the current/old questions
        questionsData = JSON.parse(data);
        console.log(questionsData);

        questionsData.quiz.push(newQuestion);

        // Convert the updated data back to JSON format
        const updatedJSON = JSON.stringify(questionsData, null, 4); // 2 is for indentation for readability

        // Write the updated JSON back to the file (assuming you're working with Node.js filesystem)
        // Write the updated JSON back to the file (assuming you're working with Node.js filesystem)
        fs.writeFile("public/database/quiz.json", updatedJSON, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Question appended successfully.');
        });
    });
});




// catch 404 and forward to error handler
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

module.exports = app;


