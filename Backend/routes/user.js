const express = require("express");
const { getUserDashboard } = require("../controllers/user");

const router = express.Router();

router.get("/dashboard", getUserDashboard);

module.exports = router;
