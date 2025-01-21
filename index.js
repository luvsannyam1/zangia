const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const connectDB = require("./configs/db");
const auth = require("./routes/user");
const answer = require("./routes/answer");
const questionnaire = require("./routes/questionnaire");
const test = require("./routes/test");
const transport = require("./configs/email");
const cirriculum = require("./routes/cirriculum");
const exam = require("./routes/exam");
const initializeSocket = require("./socket/exam");

const upload = require("./configs/upload");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.mailTransporter = transport;
app.use(express.json());
app.use(morgan());
connectDB();

app.use("/server/user", auth);
app.use("/server/answer", answer);
app.use("/server/questionnaire", questionnaire);
app.use("/server/test", test);
app.use("/server/cirriculum", cirriculum);
app.use("/server/exam", exam);

app.use("/server/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/server/upload", upload.single("image"), (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully!",
        imageUrl: `/uploads/${req.file.filename}`, // Provide URL for the uploaded image
      });
    } else {
      res.status(400).json({ success: false, message: "No file uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React client URL
    methods: ["GET", "POST"],
  },
});
initializeSocket(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
