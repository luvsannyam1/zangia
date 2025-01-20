const mongoose = require("mongoose");

const CirriculumSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Please add a name for the Subject"],
  },
  description: {
    type: String,
    required: [true, "Please add a description for the questionnaire"],
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Cirriculum", CirriculumSchema);
