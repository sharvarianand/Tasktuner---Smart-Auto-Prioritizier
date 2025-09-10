const openai = require("../config/openai");

// Predefined roasts for random selection
const predefinedRoasts = [
  {
    id: 1,
    message: "Still scrolling social media instead of being productive? Time to get your act together!",
    severity: "mild"
  },
  {
    id: 2,
    message: "Your to-do list is longer than a CVS receipt. Maybe it's time to actually DO something about it?",
    severity: "medium"
  },
  {
    id: 3,
    message: "You've been 'planning to start tomorrow' for 47 tomorrows. Today IS tomorrow!",
    severity: "spicy"
  },
  {
    id: 4,
    message: "Your procrastination skills are Olympic-level. Too bad they don't give medals for that.",
    severity: "brutal"
  },
  {
    id: 5,
    message: "You know what's harder than starting? Explaining why you didn't start. Again.",
    severity: "medium"
  },
  {
    id: 6,
    message: "Your future self called. They're disappointed but not surprised.",
    severity: "spicy"
  },
  {
    id: 7,
    message: "You've mastered the art of 'productive procrastination' - congratulations, you're still not getting anything done.",
    severity: "brutal"
  },
  {
    id: 8,
    message: "Your motivation is like a New Year's resolution - strong in January, gone by February.",
    severity: "medium"
  }
];

const getRandomRoast = async (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * predefinedRoasts.length);
    const roast = predefinedRoasts[randomIndex];
    res.status(200).json({ success: true, data: roast });
  } catch (error) {
    console.error("❌ Error getting random roast:", error.message);
    res.status(500).json({ error: "Failed to get random roast" });
  }
};

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
  getRandomRoast,
  generateRoast,
};
