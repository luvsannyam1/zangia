const express = require("express");
const {
  createAnswer,
  getAnswers,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/answer");

const router = express.Router();

router.route("/").post(createAnswer).get(getAnswers);
router.route("/:id").put(updateAnswer).delete(deleteAnswer);

module.exports = router;
