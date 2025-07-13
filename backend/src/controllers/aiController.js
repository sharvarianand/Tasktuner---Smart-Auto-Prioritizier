// src/controllers/aiController.js
const openai = require("../config/openai");

// 🔹 AI: PRIORITIZE TASKS
const prioritizeTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks array is required" });
    }

    const taskList = tasks
      .map((t, i) => `${i + 1}. ${t.title} - Deadline: ${t.deadline}, Priority: ${t.priority}`)
      .join('\n');

    const prompt = `
You are a productivity assistant. Rank the following tasks based on urgency and impact. Return them in order of priority as a numbered list with just the task titles.

Tasks:
${taskList}
`;

    console.log('🤖 Calling OpenRouter API...');

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log('✅ OpenRouter API success');

    const aiOutput = response.choices[0].message.content.trim().split('\n');
    res.status(200).json({ prioritizedTasks: aiOutput });

  } catch (error) {
    console.error("❌ Error prioritizing tasks:", error.message);
    console.error("Error details:", error.response?.data || error);

    if (error.status === 401) {
      return res.status(401).json({ error: "OpenRouter authentication failed" });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    const fallbackTasks = fallbackPrioritization(req.body.tasks);
    res.status(200).json({
      prioritizedTasks: fallbackTasks,
      note: "Used fallback prioritization due to AI service unavailability"
    });
  }
};

// 🔸 Fallback sorting logic
const fallbackPrioritization = (tasks) => {
  return tasks
    .sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return (a.priority || 3) - (b.priority || 3);
    })
    .map((task, index) => `${index + 1}. ${task.title}`);
};

// 🔹 AI: GENERATE TASKS FROM GOAL
const generateTasksFromGoal = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal || goal.trim() === "") {
      return res.status(400).json({ error: "Goal is required" });
    }

    const prompt = `
You are a productivity assistant. Your task is to break the following goal into 8–12 short, structured, action-oriented tasks. Each task must include a "title" and a "priority" (either "high", "medium", or "low").

Only output valid JSON, like this:
[
  { "title": "Create study plan", "priority": "high" },
  { "title": "Revise DSA weekly", "priority": "medium" }
]

Respond only with the JSON. No explanations.

Goal: "${goal}"
`;

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
      temperature: 0.7,
      stop: ["]"]
    });

    let rawContent = response.choices[0].message.content.trim();
    if (!rawContent.endsWith("]")) {
      rawContent += "]";
    }

    let parsedTasks = [];
    try {
      parsedTasks = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON from AI response:", rawContent);
      return res.status(500).json({ error: "AI response was not valid JSON", raw: rawContent });
    }

    res.status(200).json({ generatedTasks: parsedTasks });

  } catch (error) {
    console.error("❌ Error generating tasks:", error.message);
    res.status(500).json({ error: "Failed to generate tasks from goal" });
  }
};




module.exports = {
  prioritizeTasks,
  generateTasksFromGoal,
};

