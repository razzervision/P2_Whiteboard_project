const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class User extends Model {}

User.init({
    // Model attributes are defined here
    xPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    yPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    picture: {
        type: DataTypes.BLOB,
        allowNull: false
    }

}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "paint" // We need to choose the model name
});

module.exports = User;