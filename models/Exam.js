const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.ObjectId,
    ref: "Test",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  evaluation: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Static method to fetch Exam data and aggregate with ExamResult data
ExamSchema.statics.getExamWithResults = async function () {
  return this.aggregate([
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
};

module.exports = mongoose.model("Exam", ExamSchema);
