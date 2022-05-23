const express = require("express");

const router = express.Router();

const regControl = require("../controllers/regControl");

const mailing = require("../email/sendMail");

const { sendMail, verifyEmail } = mailing;


//routes
router.post("/signup", regControl.newUser);

router.post("/login", regControl.saveUser);

router.get("/logout", regControl.logout)

// router.put("/reset-password", regControl.resetPassword);

router.post("/reset/:resetToken", regControl.passwordReset);

router.put("/forgotten-password/:email", regControl.forgottenPassword);

router.put("/reset-forgotten/:resetToken", regControl.resetForgotten);

router.post("/mail", sendMail);

router.get('/verified-email/:confirmToken', regControl.emailVerified)

module.exports = router;
