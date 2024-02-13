const express = require("express");
const { postSignUp, postLogin, postLogout } = require("../controllers/auth");
const { signUpValidator } = require("../validation");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    return cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/signup",
  upload.single("profilePicture"),
  signUpValidator,
  postSignUp
);
router.post("/signin", postLogin);
router.post("/logout", postLogout);

module.exports = router;
