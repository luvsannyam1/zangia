const jwt = require("jsonwebtoken");

const { getPopulatedTestData } = require("../controllers/test");
const { evaluateTest } = require("../controllers/evaluation");

let activeExams = {};

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const token = socket.handshake.auth.token;
    let userId = "";
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      userId = decoded.id;
    } catch (err) {
      console.log(err);
    }

    socket.join(userId);

    // Start an exam
    socket.on("startExam", async ({ testId }) => {
      let test = await getPopulatedTestData(testId);

      if (!test) {
        socket.emit("error", { message: "Exam not found" });
        return;
      }

      socket.join(userId);
      // Initialize the exam timer for the user
      if (!activeExams[userId]) {
        const interval = setInterval(() => {
          if (!activeExams[userId]) {
            clearInterval(interval); // Stop timer if exam is finished
            return;
          }
          io.to(userId).emit("timerUpdate", {
            timeRemaining: activeExams[userId].timeRemaining,
          });

          activeExams[userId].timeRemaining -= 1;

          if (activeExams[userId]?.timeRemaining <= 0) {
            clearInterval(interval); // Stop timer

            evaluateTest(
              userId,
              activeExams[userId].testId,
              activeExams[userId].answers
            );
            delete activeExams[userId]; // Remove the user from active exams
            io.to(userId).emit("examFinished", { message: "Time is up!" });
          }
        }, 1000);

        activeExams[userId] = {
          testId,
          timeRemaining: test.duration,
          answers: [],
        };
      } else {
        test = activeExams[userId];
      }

      socket.emit("examStarted", {
        test: test,
        timeRemaining: test.duration,
        answers: activeExams[userId].answers,
      });
    });
    socket.on("finishTest", ({ answer }) => {
      evaluateTest(userId, activeExams[userId].testId, answer);
      delete activeExams[userId];
      io.to(userId).emit("examFinished", { message: "Finished!" });
    });

    // Submit answer
    socket.on("submitAnswer", ({ questionId, answer }) => {
      const userExam = activeExams[userId];
      if (!userExam) {
        socket.emit("error", {
          message: "Exam not started or already finished",
        });
        return;
      }

      console.log(
        `User ${userId} submitted answer for question ${userExam.testId} , ${questionId}:`,
        answer
      );

      const answerValue = { questionId, answer };

      const exists = activeExams[userId].answers.findIndex(
        (record) => record.questionId === answerValue.questionId
      );

      // Add the record if it doesn't exist
      if (exists === -1) {
        activeExams[userId].answers.push(answerValue);
      } else {
        activeExams[userId].answers[exists].answer = answerValue.answer;
      }

      socket.emit("answerSubmitted", answerValue);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
