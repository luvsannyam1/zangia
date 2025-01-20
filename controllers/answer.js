const Answer = require("../models/Answer"); // Import the Answer model
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");

// @desc    Create a new answer
// @route   POST /api/v1/answers
// @access  Public
exports.createAnswer = asyncHandler(async (req, res, next) => {
  const { description, imageUrl } = req.body;

  const answer = await Answer.create({ description, imageUrl });

  res.status(201).json({
    success: true,
    data: answer,
  });
});

// @desc    Get all answers
// @route   GET /api/v1/answers
// @access  Public
exports.getAnswers = asyncHandler(async (req, res, next) => {
  const answers = await Answer.find();

  res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});

// @desc    Update an answer
// @route   PUT /api/v1/answers/:id
// @access  Public
exports.updateAnswer = asyncHandler(async (req, res, next) => {
  let answer = await Answer.findById(req.params.id);

  if (!answer) {
    return next(
      new ErrorResponse(`Answer not found with id ${req.params.id}`, 404)
    );
  }

  answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: answer,
  });
});

// @desc    Delete an answer
// @route   DELETE /api/v1/answers/:id
// @access  Public
exports.deleteAnswer = asyncHandler(async (req, res, next) => {
  const answer = await Answer.findByIdAndDelete({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
