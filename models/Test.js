const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  cirriculumId: {
    type: mongoose.Schema.ObjectId,
    ref: "Cirriculum",
  },
  title: {
    type: String,
    unique: true,
    required: [true, "Please add a title for the test"],
  },
  description: {
    type: String,
    required: [true, "Please add a description for the test"],
  },
  testQuestions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Questionnaire",
    },
  ],
  duration: {
    type: Number,
  },
});

module.exports = mongoose.model("Test", TestSchema);
