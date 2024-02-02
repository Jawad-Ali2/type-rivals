const express = require("express");
const { getUserDashboard } = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/dashboard", isAuth, getUserDashboard);

module.exports = router;
