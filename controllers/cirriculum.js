const Curriculum = require("../models/Cirriculum"); // Import the Curriculum model
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");

// @desc    Create a new curriculum
// @route   POST /api/v1/curriculums
// @access  Public
exports.createCurriculum = asyncHandler(async (req, res, next) => {
  const { title, description, imageUrl } = req.body;

  const curriculum = await Curriculum.create({ title, description, imageUrl });

  res.status(201).json({
    success: true,
    data: curriculum,
  });
});

// @desc    Get all curriculums
// @route   GET /api/v1/curriculums
// @access  Public
exports.getCurriculums = asyncHandler(async (req, res, next) => {
  const curriculums = await Curriculum.aggregate([
    {
      $lookup: {
        from: "tests", // The collection name of the 'Test' model in MongoDB
        localField: "_id", // Field in 'Cirriculum' to match
        foreignField: "cirriculumId", // Field in 'Test' to match
        as: "tests", // The name of the array to store the matched results
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: curriculums.length,
    data: curriculums,
  });
});

// @desc    Get a single curriculum by ID
// @route   GET /api/v1/curriculums/:id
// @access  Public
exports.getCurriculum = asyncHandler(async (req, res, next) => {
  const curriculum = await Curriculum.findById(req.params.id);

  if (!curriculum) {
    return next(
      new ErrorResponse(`Curriculum not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: curriculum,
  });
});

// @desc    Update a curriculum
// @route   PUT /api/v1/curriculums/:id
// @access  Public
exports.updateCurriculum = asyncHandler(async (req, res, next) => {
  const { title, description, imageUrl } = req.body;

  let curriculum = await Curriculum.findById(req.params.id);

  if (!curriculum) {
    return next(
      new ErrorResponse(`Curriculum not found with id ${req.params.id}`, 404)
    );
  }

  curriculum = await Curriculum.findByIdAndUpdate(
    req.params.id,
    { title, description, imageUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: curriculum,
  });
});

// @desc    Delete a curriculum
// @route   DELETE /api/v1/curriculums/:id
// @access  Public
exports.deleteCurriculum = asyncHandler(async (req, res, next) => {
  const curriculum = await Curriculum.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
