const express = require("express");
const router = express.Router();
const { generateVoiceRoast } = require("../controllers/voiceController"); // ✅ This must match the export

router.post("/roast-audio", generateVoiceRoast); // ✅ Uses the correct function

module.exports = router;
