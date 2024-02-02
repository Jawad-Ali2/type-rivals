const express = require("express");
const { postSignUp, postLogin, postLogout } = require("../controllers/auth");
const { signUpValidator } = require("../validation");

const router = express.Router();

router.post("/signup", signUpValidator, postSignUp);
router.post("/signin", postLogin);
router.post("/logout", postLogout);

module.exports = router;
