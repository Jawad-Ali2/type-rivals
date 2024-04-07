const express = require("express");
const isAuth = require("../middleware/isAuth");
const { verifyLobbyCode } = require("../controllers/race");

const router = express.Router();

router.post("/verifyLobbyCode", verifyLobbyCode);

module.exports = router;
