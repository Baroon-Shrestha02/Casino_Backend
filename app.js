require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mail = require("./Routes/MailRoutes");

const app = express();

// Enable CORS for all origins
const allowedOrigins = [
  "https://casinotrainingnepal.com",
  "https://www.casinotrainingnepal.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running and CORS is configured ✅");
});

app.use("/casino", mail);

module.exports = app;
