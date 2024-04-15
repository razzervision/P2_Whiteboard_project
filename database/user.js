const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class User extends Model {}

User.init({
    // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User" // We need to choose the model name
});

module.exports = User;