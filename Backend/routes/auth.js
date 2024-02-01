const express = require("express");
const { postSignUp, postLogin } = require("../controllers/auth");
const { body } = require("express-validator");
const { signUpValidator } = require("../validation");

const router = express.Router();

router.post("/signup", signUpValidator, postSignUp);
router.post("/signin", postLogin);

module.exports = router;
