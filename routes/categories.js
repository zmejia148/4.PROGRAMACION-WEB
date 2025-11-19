const express = require("express");
const router = express.Router();
const db = require("../data/data.json");

// GET all categories
router.get("/", (req, res) => {
    res.json(db.categories);
});

module.exports = router;
