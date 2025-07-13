// src/controllers/aiController.js
const openai = require("../config/openai");

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

    // ✅ Updated to use OpenRouter compatible model
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free", // Free model on OpenRouter
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log('✅ OpenRouter API success');

    // ✅ Extract AI-generated output
    const aiOutput = response.choices[0].message.content.trim().split('\n');

    res.status(200).json({ prioritizedTasks: aiOutput });
  } catch (error) {
    console.error("❌ Error prioritizing tasks:", error.message);
    console.error("Error details:", error.response?.data || error);
    
    if (error.status === 401) {
      console.error('🔑 Authentication failed. Check your OpenRouter API key.');
      return res.status(401).json({ error: "OpenRouter authentication failed" });
    }
    
    if (error.status === 429) {
      console.error('📊 Rate limit exceeded or quota exhausted.');
      return res.status(429).json({ error: "Rate limit exceeded" });
    }
    
    // Fallback prioritization when OpenRouter fails
    console.log('⚠️ Using fallback prioritization');
    const fallbackTasks = fallbackPrioritization(req.body.tasks);
    res.status(200).json({ 
      prioritizedTasks: fallbackTasks,
      note: "Used fallback prioritization due to AI service unavailability"
    });
  }
};

// Simple fallback when OpenRouter is unavailable
const fallbackPrioritization = (tasks) => {
  return tasks
    .sort((a, b) => {
      // Sort by deadline first, then by priority
      if (a.deadline && b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return (a.priority || 3) - (b.priority || 3);
    })
    .map((task, index) => `${index + 1}. ${task.title}`);
};

module.exports = {
  prioritizeTasks,
};
