require('dotenv').config();
const OpenAI = require('openai');

// Debug OpenRouter API key loading
console.log('🔍 OpenRouter API Key loaded:', process.env.OPENROUTER_API_KEY ? 'Yes ✅' : 'No ❌');
console.log('🔑 API Key preview:', process.env.OPENROUTER_API_KEY?.substring(0, 15) + '...');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001", // customize this for your domain if needed
    "X-Title": "TaskTuner"
  }
});

module.exports = openai;
