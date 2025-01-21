const Test = require("../models/Test");
const ExamResult = require("../models/ExamResult");
const Exam = require("../models/Exam");

exports.evaluateTest = async (userId, testId, userAnswers) => {
  try {
    // Fetch the test with its related questions
    const test = await Test.findById(testId).populate({
      path: "testQuestions",
      populate: {
        path: "answers correctAnswer",
      },
    });

    let score = 0;
    let totalQuestions = test?.testQuestions.length;

    const exam = await Exam.create({ testId, userId });
    for (let question of test.testQuestions) {
      const userAnswer = userAnswers.find(
        (answer) => answer.questionId === question._id.toHexString()
      );
      if (!userAnswer) continue;
      if (userAnswer.answer === question.correctAnswer._id.toHexString()) {
        score++;
        await ExamResult.create({
          examId: exam._id,
          testId,
          questionId: question._id,
          answerId: userAnswer.answer,
          correct: true,
        });
      } else {
        await ExamResult.create({
          examId: exam._id,
          testId,
          questionId: question._id,
          answerId: userAnswer.answer,
          correct: false,
        });
      }
    }
    exam.evaluation = (score / totalQuestions) * 100;
    exam.save();

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
    return null;
  }
};
