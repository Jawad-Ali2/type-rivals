const { body } = require("express-validator");
const User = require("../models/user");

exports.signUpValidator = [
  body("name").trim().not().isEmpty(),
  body("email")
    .isEmail()
    .withMessage("Please enter your email address")
    .custom(async (value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          throw new Error("Email already exists");
        }
      });
    })
    .normalizeEmail(),
  body("password", "Password should be at least 5 letters.")
    .trim()
    .isLength({ min: 5 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];
