require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileupload");
const mail = require("./Routes/MailRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://hotelsherpasoul.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow request
      } else {
        callback(new Error("Not allowed by CORS")); // Block others
      }
    },
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
