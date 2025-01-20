const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please add a description for the questionnaire"],
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Answer", AnswerSchema);
