const Exam = require("../models/Exam"); // Import the Answer model
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");

exports.createNewExamAttempt = async (data) => {
  const { testId, userId } = data;

  const exam = await Answer.create({ testId, userId });
  return exam;
};

exports.getExamResults = asyncHandler(async (req, res, next) => {
  const examResults = await Exam.aggregate([
    {
      $lookup: {
        from: "examresults",
        localField: "_id",
        foreignField: "examId",
        as: "examResults",
      },
    },
    {
      $lookup: {
        from: "tests",
        localField: "testId",
        foreignField: "_id",
        as: "test",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$test" },
    { $unwind: "$user" },
  ]);

  res.status(200).json({
    success: true,
    count: examResults.length,
    data: examResults,
  });
});
