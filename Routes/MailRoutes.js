const express = require("express");
const { sendMail } = require("../Controllers/MailController");
const { contactMail } = require("../Controllers/contactController");

const router = express.Router();

router.post("/send", sendMail);
router.post("/contact", contactMail);

module.exports = router;
