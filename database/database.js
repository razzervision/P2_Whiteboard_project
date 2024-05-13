const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("whiteboardDB", "root", "root", {
    host: "./database/database.sqlite",
    dialect: "sqlite",
    logging: false
});

module.exports = sequelize;