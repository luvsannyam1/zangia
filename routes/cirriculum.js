const express = require("express");
const {
  createCurriculum,
  getCurriculums,
  getCurriculum,
  updateCurriculum,
  deleteCurriculum,
} = require("../controllers/cirriculum");

const router = express.Router();

router
  .route("/")
  .post(createCurriculum) // Create a curriculum
  .get(getCurriculums); // Get all curriculums

router
  .route("/:id")
  .get(getCurriculum) // Get a single curriculum
  .put(updateCurriculum) // Update a curriculum
  .delete(deleteCurriculum); // Delete a curriculum

module.exports = router;
