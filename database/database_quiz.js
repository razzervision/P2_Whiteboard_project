const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");

class QuizName extends Model {}

QuizName.init({
    // Model attributes are defined here
    quizName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "QuizName"
});

class Question extends Model {}

Question.init({
    // Model attributes are defined here
    questionText: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Question"
});

class Answer extends Model {}

Answer.init({
    // Model attributes are defined here
    answerText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Answer"
});


// Define associations
QuizName.hasMany(Question);
Question.belongsTo(QuizName);

Question.hasMany(Answer);
Answer.belongsTo(Question);

module.exports = { QuizName, Question, Answer };
