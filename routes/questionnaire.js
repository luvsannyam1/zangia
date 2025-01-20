const express = require("express");
const {
  createQuestionnaire,
  getQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaire,
} = require("../controllers/questionnaire");

const router = express.Router();

router.route("/").post(createQuestionnaire).get(getQuestionnaires);
router.route("/:id").put(updateQuestionnaire).delete(deleteQuestionnaire);

module.exports = router;
