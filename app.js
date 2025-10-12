require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mail = require("./Routes/MailRoutes");

const app = express();

// Enable CORS for all origins
app.use(
  cors({
    origin: [
      "https://casinotrainingnepal.com", // your live frontend domain
      "https://www.casinotrainingnepal.com", // include www version (optional)
      "http://localhost:5173", // optional: local dev environment (React)
    ],
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

app.use("/casino", mail);

module.exports = app;
