const express = require("express");
const mongoose = require("mongoose");
const regRoute = require("./routes/regRoute");
const todoRoute = require("./routes/todoRoute");
const nodemailer = require('nodemailer')

const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const dotenv = require("dotenv").config();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3010;

const morgan = require("morgan");
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: "GET,POST,OPTIONS,PUT,DELETE",
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));
// app.use(regRoute);

const mongoUrl = "mongodb://127.0.0.1:27017/todo-app";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    if (result) console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware for routers
app.use("/users", regRoute);
app.use("/", todoRoute);

app.post('/mailer',(req,res) => {
  const {email} = req.body

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "richelleyiren@gmail.com",
      pass: "elrqyscmxqtigvpw",
    },
  });

  const mailOptions = {
    from: "richelleyiren@gmail.com",
    to: `${email}`,
    subject: "Sending Email using Node.js",
    text: "yay!, it worked",
    // html: "<b> Hello World</>"
  };
  

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.send('email sent, check your mail')
})

app.listen(PORT, () => console.log(`server running on port ${PORT} `));
