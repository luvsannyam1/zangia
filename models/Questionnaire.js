const mongoose = require("mongoose");

const QuestionnaireSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please add a description for the questionnaire"],
  },
  answers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Answer",
    },
  ],
  imgUrls: {
    type: [String], // Array of image URLs
    default: [],
  },
  videoUrls: {
    type: [String], // Array of video URLs
    default: [],
  },
  correctAnswer: {
    type: mongoose.Schema.ObjectId,
    ref: "Answer",
  },
});

module.exports = mongoose.model("Questionnaire", QuestionnaireSchema);
