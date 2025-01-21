const express = require("express");
const { getExamResults } = require("../controllers/exam");

const router = express.Router();

router.route("/").get(getExamResults);

module.exports = router;
