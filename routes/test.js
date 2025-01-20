const express = require("express");
const {
  createTest,
  getTests,
  updateTest,
  deleteTest,
  getTestsByCirriculum,
  getPopulatedTest,
} = require("../controllers/test");

const router = express.Router();

router.route("/").post(createTest).get(getTests);
router.route("/:id").put(updateTest).delete(deleteTest);
router.route("/cirriculum/:id").get(getTestsByCirriculum);
router.route("/populated/:id").get(getPopulatedTest);

module.exports = router;
