const User = require("../database/user");
const express = require("express");
const router = express.Router();
const sequelize = require("../database/database");


/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Mikkel er cool" });
});

router.post("/users", (req, res) => {
    User.create(req.body).then((user) => {
        res.status(201).json(user);
    }).catch((error) => {
        console.error(error);
        res.status(400).send("Error creating user");
    });
});

router.get("/:room", function(req, res, next) {
    res.render("index", { room: req.params.room, title: "Together Paint"});
});


module.exports = router;
