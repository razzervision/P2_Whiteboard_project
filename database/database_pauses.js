const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");

class Pause extends Model {}

Pause.init({
    session: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastTimePauseOccurred: {
        type: DataTypes.DATE,
        allowNull: true
    },
    websiteActivity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    leftWebsite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    averageTimeLeftWebsite: {
        type: DataTypes.INTEGER,
        allowNull: false
    }    
}, {
    sequelize,
    modelName: "Pause"
});


module.exports = Pause;
