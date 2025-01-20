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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Exam", ExamSchema);
