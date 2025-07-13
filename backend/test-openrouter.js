require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "TaskTuner",
  },
});

async function testOpenRouter() {
  try {
    console.log('🔍 Testing OpenRouter API...');
    console.log('API Key loaded:', process.env.OPENROUTER_API_KEY ? 'Yes ✅' : 'No ❌');
    console.log('API Key preview:', process.env.OPENROUTER_API_KEY?.substring(0, 15) + '...');
    
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: "Hello! Can you prioritize these tasks: 1. Buy groceries, 2. Finish project report?" }],
      max_tokens: 100,
    });
    
    console.log('✅ OpenRouter API works!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ OpenRouter test failed:', error.message);
    console.error('Error status:', error.status);
    console.error('Full error:', error.response?.data || error);
  }
}

testOpenRouter();
