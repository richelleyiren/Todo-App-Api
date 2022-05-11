const express = require("express");

const router = express.Router();

const regControl = require("../controllers/regControl");


//routes
router.post("/signup", regControl.newUser);

router.post("/login", regControl.saveUser);

router.post("/logout", regControl.logout)

// router.put("/reset-password", regControl.resetPassword);

router.post("/reset", regControl.passwordReset);

module.exports = router;
