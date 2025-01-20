const mongoose = require("mongoose");

const ExamResultSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.ObjectId,
    ref: "Exam",
  },
  testId: {
    type: mongoose.Schema.ObjectId,
    ref: "Test",
  },
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: "Questionnaire",
  },
  answerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Answer",
  },
  correct: {
    type: Boolean,
  },
});

module.exports = mongoose.model("ExamResult", ExamResultSchema);
