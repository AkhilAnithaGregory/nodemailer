const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "client", "build")));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email", // Replace with your Gmail address
    pass: "passcode", // Check Readme for details
  },
});

app.post("/contact", (req, res) => {
  const { email, name, subject, message } = req.body;

  const mailOptions = {
    from: '"Label" <email>', // Replace with your from Gmail address
    to: "email", // Replace with your to Gmail address
    subject: `${subject}`,
    text: `${name}\n${email}\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({
        success: false,
        message: "There was an error sending the email!",
      });
    } else {
      res.json({ success: true, message: "Email sent successfully!" });
      addLabelToEmail(info.messageId);
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
