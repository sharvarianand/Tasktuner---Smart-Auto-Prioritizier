const openai = require("../config/openai");

const generateRoast = async (req, res) => {
  const { taskTitle, role } = req.body;

  if (!taskTitle || !role) {
    return res.status(400).json({ error: "Task title and role are required" });
  }

const prompt = `
You are a sarcastic productivity coach who delivers short, funny, punchy roasts when users fail to complete a task.

Generate **1 short roast** (under 20 words) for someone who hasn’t completed this task: "${taskTitle}".

Be unpredictable — sometimes Gen-Z slang, sometimes witty sarcasm, sometimes motivational mockery. 

No labels. No explanation. Just return the roast sentence.
`;



  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.9,
    });

    const roast = response.choices[0].message.content.trim();
    res.status(200).json({ roast });

  } catch (error) {
    console.error("❌ Error generating roast:", error.message);
    res.status(500).json({ error: "Failed to generate roast" });
  }
};

module.exports = {
  generateRoast,
};
