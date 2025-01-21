const Test = require("../models/Test");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");
const Questionnaire = require("../models/Questionnaire");

// @desc    Create a new test
// @route   POST /api/v1/tests
// @access  Public
exports.createTest = asyncHandler(async (req, res, next) => {
  const { cirriculumId, title, description, testQuestions, duration } =
    req.body;

  // Ensure testQuestions contains valid ObjectIds
  if (testQuestions && testQuestions.length > 0) {
    const validQuestions = await Questionnaire.find({
      _id: { $in: testQuestions },
    });
    if (validQuestions.length !== testQuestions.length) {
      return next(new ErrorResponse("One or more questions are invalid", 400));
    }
  }

  const test = await Test.create({
    cirriculumId,
    title,
    description,
    testQuestions,
    duration,
  });

  res.status(201).json({
    success: true,
    data: test,
  });
});

// @desc    Get all tests
// @route   GET /api/v1/tests
// @access  Public
exports.getTests = asyncHandler(async (req, res, next) => {
  const tests = await Test.find();

  res.status(200).json({
    success: true,
    count: tests.length,
    data: tests,
  });
});

// @desc    Update a test
// @route   PUT /api/v1/tests/:id
// @access  Public
exports.updateTest = asyncHandler(async (req, res, next) => {
  const { cirriculumId, title, description, testQuestions } = req.body;

  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(`Test not found with id ${req.params.id}`, 404)
    );
  }

  // Validate testQuestions
  if (testQuestions && testQuestions.length > 0) {
    const validQuestions = await Questionnaire.find({
      _id: { $in: testQuestions },
    });
    if (validQuestions.length !== testQuestions.length) {
      return next(new ErrorResponse("One or more questions are invalid", 400));
    }
  }

  test = await Test.findByIdAndUpdate(
    req.params.id,
    { cirriculumId, title, description, testQuestions },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: test,
  });
});

// @desc    Delete a test
// @route   DELETE /api/v1/tests/:id
// @access  Public
exports.deleteTest = asyncHandler(async (req, res, next) => {
  await Test.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get populated test by cirriculum
// @route   GET /api/v1/test/cirriculum/:id
// @access  Public
exports.getTestsByCirriculum = asyncHandler(async (req, res, next) => {
  const tests = await Test.find({ cirriculumId: req.params.id }).populate({
    path: "testQuestions",
    populate: { path: "answers correctAnswer" },
  });

  res.status(200).json({
    success: true,
    count: tests.length,
    data: tests,
  });
});

// @desc    Get populated test by cirriculum
// @route   GET /api/v1/test/cirriculum/:id
// @access  Public
exports.getPopulatedTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id).populate({
    path: "testQuestions",
    populate: { path: "answers correctAnswer" },
  });

  res.status(200).json({
    success: true,
    data: test,
  });
});

exports.getPopulatedTestData = asyncHandler(async (id) => {
  const test = await Test.findById(id).populate({
    path: "testQuestions",
    populate: { path: "answers correctAnswer" },
  });
  if (test.length <= 10) {
    return arr;
  }

  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
});
