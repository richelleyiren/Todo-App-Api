const express = require("express");

const router = express.Router();

const regControl = require("../controllers/regControl");

const mailing = require("../email/sendMail");

const { sendMail } = mailing;


//routes
router.post("/signup", regControl.newUser);

router.post("/login", regControl.saveUser);

router.get("/logout", regControl.logout)

// router.put("/reset-password", regControl.resetPassword);

router.post("/reset", regControl.passwordReset);

router.put("/forgotten-password/:email", regControl.forgottenPassword);

router.post("/mail", sendMail);

module.exports = router;
