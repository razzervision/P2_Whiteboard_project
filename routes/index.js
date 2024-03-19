const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.get("/:room", function(req, res, next) {
    res.render("index", { room: req.params.room, title: "Together Paint"});
});


module.exports = router;
