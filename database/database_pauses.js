const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");

class Pause extends Model {}

Pause.init({
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

class PauseSession extends Model {}

PauseSession.init({
    session: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    lastPause: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "PauseSession"
});

// Define associations
PauseSession.hasMany(Pause);
Pause.belongsTo(PauseSession);

module.exports = { Pause, PauseSession};
