const Questionnaire = require("../models/Questionnaire"); // Import the Questionnaire model
const Answer = require("../models/Answer"); // Import the Answer model
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new questionnaire
// @route   POST /api/v1/questionnaires
// @access  Public
exports.createQuestionnaire = asyncHandler(async (req, res, next) => {
  const { question, answers, correctAnswer, imgUrls, videoUrls } = req.body;

  // Validate if correctAnswer exists in answers array
  if (answers && answers.includes(correctAnswer)) {
    return next(
      new ErrorResponse("Correct answer must be one of the answers", 400)
    );
  }

  const questionnaire = await Questionnaire.create({
    question,
    answers,
    correctAnswer,
    imgUrls,
    videoUrls,
  });

  res.status(201).json({
    success: true,
    data: questionnaire,
  });
});

// @desc    Get all questionnaires
// @route   GET /api/v1/questionnaires
// @access  Public
exports.getQuestionnaires = asyncHandler(async (req, res, next) => {
  const questionnaires = await Questionnaire.find();

  res.status(200).json({
    success: true,
    count: questionnaires.length,
    data: questionnaires,
  });
});

// @desc    Update a questionnaire
// @route   PUT /api/v1/questionnaires/:id
// @access  Public
exports.updateQuestionnaire = asyncHandler(async (req, res, next) => {
  const { question, answers, correctAnswer, imgUrls, videoUrls } = req.body;

  let questionnaire = await Questionnaire.findById(req.params.id);

  if (!questionnaire) {
    return next(
      new ErrorResponse(`Questionnaire not found with id ${req.params.id}`, 404)
    );
  }

  // Validate if correctAnswer exists in answers array
  if (answers.length === 0) {
    return next(
      new ErrorResponse("Correct answer must be one of the answers", 400)
    );
  }

  questionnaire = await Questionnaire.findByIdAndUpdate(
    req.params.id,
    {
      question,
      answers,
      correctAnswer: answers[0],
      imgUrls,
      videoUrls,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: questionnaire,
  });
});

// @desc    Delete a questionnaire
// @route   DELETE /api/v1/questionnaires/:id
// @access  Public
exports.deleteQuestionnaire = asyncHandler(async (req, res, next) => {
  const questionnaire = await Questionnaire.findById(req.params.id);

  if (!questionnaire) {
    return next(
      new ErrorResponse(`Questionnaire not found with id ${req.params.id}`, 404)
    );
  }

  await questionnaire.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
