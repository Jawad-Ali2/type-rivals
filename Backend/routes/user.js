const express = require("express");
const { getUserDashboard, quickRaceTrack } = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/dashboard", isAuth, getUserDashboard);
router.get("/quick-race", isAuth, quickRaceTrack);

module.exports = router;
