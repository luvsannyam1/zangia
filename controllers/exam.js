const Exam = require("../models/Exam"); // Import the Answer model
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");

// @desc    Create a new answer
// @route   POST /api/v1/answers
// @access  Public
exports.createNewExamAttempt = async (data) => {
  const { testId, userId, date } = data;

  const exam = await Answer.create({ testId, userId });
  return exam;
};
