require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mail = require("./Routes/MailRoutes");

const app = express();

// Enable CORS for all origins
app.use(
  cors({
    origin: true, // allow all origins
    credentials: true, // allow cookies if needed
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
