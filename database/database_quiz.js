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

class Session extends Model {}

Session.init({
    // Model attributes are defined here
    sessionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sessionOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Session"
});


class UserAnswer extends Model {}

UserAnswer.init({
    // Model attributes are defined here
    userId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "UserAnswer"
});

// Define associations
QuizName.hasMany(Question);
Question.belongsTo(QuizName);

QuizName.hasMany(Session);
Session.belongsTo(QuizName);

Question.hasMany(Answer);
Answer.belongsTo(Question);

Session.hasMany(UserAnswer);
UserAnswer.belongsTo(Session);

Answer.hasMany(UserAnswer);
UserAnswer.belongsTo(Answer);


module.exports = { QuizName, Question, Answer, UserAnswer , Session };
