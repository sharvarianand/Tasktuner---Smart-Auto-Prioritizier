// 🎤 Clean Voice Controller - Web Speech API Only for Hackathon
const generateVoiceRoast = async (req, res) => {
  const { roastText } = req.body;

  if (!roastText) {
    return res.status(400).json({ error: "Roast text is required" });
  }

  // Return optimized config for Web Speech API
  res.json({
    success: true,
    text: roastText,
    voiceConfig: {
      rate: 0.9,
      pitch: 0.6,
      volume: 1.0
    }
  });
};

module.exports = {
  generateVoiceRoast
};
