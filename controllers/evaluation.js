const mongoose = require("mongoose");
const Test = require("../models/Test");

exports.evaluateTest = async (testId, userAnswers) => {
  try {
    // Fetch the test with its related questions
    const test = await Test.findById(testId).populate({
      path: "testQuestions",
      populate: {
        path: "answers correctAnswer",
      },
    });

    let score = 0;
    let totalQuestions = test.testQuestions.length;

    // Iterate over the test questions
    for (let question of test.testQuestions) {
      const userAnswer = userAnswers.find(
        (answer) => answer.questionId === question._id.toHexString()
      );
      if (!userAnswer) continue; // Skip if no answer provided for the question

      // Compare user's answer to the correct answer
      if (userAnswer.answer === question.correctAnswer._id.toHexString()) {
        score++;
      }
    }

    // Return the evaluation result
    const result = {
      totalQuestions,
      score,
      percentage: (score / totalQuestions) * 100,
      feedback: score === totalQuestions ? "Perfect!" : "Try again!",
    };

    return result;
  } catch (error) {
    console.error("Error evaluating the test:", error);
    throw new Error("Evaluation failed");
  }
};
